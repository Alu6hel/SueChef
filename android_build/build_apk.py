# -*- coding: utf-8 -*-
import os
import sys
import shutil
import subprocess
import zipfile

def run_cmd(cmd, cwd=None):
    print(f"Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"STDERR:\n{res.stderr}")
        print(f"STDOUT:\n{res.stdout}")
        raise RuntimeError(f"Command failed with code {res.returncode}: {cmd}")
    return res.stdout

def build_apk():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    dist_dir = os.path.join(root_dir, "dist")
    assets_dir = os.path.join(script_dir, "assets")
    build_dir = os.path.join(script_dir, "build")

    sdk_dir = r"C:\Users\Alu\AppData\Local\Android\Sdk"
    android_jar = os.path.join(sdk_dir, "platforms", "android-36", "android.jar")
    build_tools = os.path.join(sdk_dir, "build-tools", "36.0.0")
    aapt2 = os.path.join(build_tools, "aapt2.exe")
    d8 = os.path.join(build_tools, "d8.bat")
    zipalign = os.path.join(build_tools, "zipalign.exe")
    apksigner = os.path.join(build_tools, "apksigner.bat")

    print("=== Step 1: Syncing web dist/ to android assets/ ===")
    if not os.path.exists(dist_dir):
        raise RuntimeError("dist directory does not exist! Run npm run build first.")
    
    if os.path.exists(assets_dir):
        shutil.rmtree(assets_dir)
    shutil.copytree(dist_dir, assets_dir)
    print(f"Assets copied to {assets_dir}")

    # Recreate build directory
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)
    os.makedirs(os.path.join(build_dir, "gen"), exist_ok=True)
    os.makedirs(os.path.join(build_dir, "classes"), exist_ok=True)
    os.makedirs(os.path.join(build_dir, "dex"), exist_ok=True)

    print("=== Step 2: Compiling Android resources with AAPT2 ===")
    compiled_res = os.path.join(build_dir, "compiled_res.zip")
    res_dir = os.path.join(script_dir, "res")
    run_cmd(f'"{aapt2}" compile --dir "{res_dir}" -o "{compiled_res}"')

    print("=== Step 3: Linking Android resources ===")
    manifest = os.path.join(script_dir, "AndroidManifest.xml")
    gen_dir = os.path.join(build_dir, "gen")
    res_apk = os.path.join(build_dir, "resources.apk")
    run_cmd(f'"{aapt2}" link "{compiled_res}" -I "{android_jar}" --manifest "{manifest}" --java "{gen_dir}" -o "{res_apk}" --auto-add-overlay')

    print("=== Step 4: Compiling Java Sources ===")
    classes_dir = os.path.join(build_dir, "classes")
    java_files = []
    src_dir = os.path.join(script_dir, "src")
    for r, _, files in os.walk(src_dir):
        for f in files:
            if f.endswith(".java"):
                java_files.append(os.path.join(r, f))
    for r, _, files in os.walk(gen_dir):
        for f in files:
            if f.endswith(".java"):
                java_files.append(os.path.join(r, f))

    java_sources = ' '.join(f'"{p}"' for p in java_files)
    run_cmd(f'javac -encoding UTF-8 -cp "{android_jar}" -d "{classes_dir}" {java_sources}')

    print("=== Step 5: Converting bytecode to DEX with D8 ===")
    dex_dir = os.path.join(build_dir, "dex")
    class_files = []
    for r, _, files in os.walk(classes_dir):
        for f in files:
            if f.endswith(".class"):
                class_files.append(os.path.join(r, f))
    class_args = ' '.join(f'"{p}"' for p in class_files)
    run_cmd(f'"{d8}" --output "{dex_dir}" --lib "{android_jar}" {class_args}')

    print("=== Step 6: Packaging APK with classes.dex & assets/ ===")
    unaligned_apk = os.path.join(build_dir, "unaligned.apk")
    shutil.copy2(res_apk, unaligned_apk)

    # Add classes.dex and assets using Python zipfile
    classes_dex = os.path.join(dex_dir, "classes.dex")
    with zipfile.ZipFile(unaligned_apk, 'a') as zf:
        zf.write(classes_dex, "classes.dex")
        for r, _, files in os.walk(assets_dir):
            for f in files:
                full_p = os.path.join(r, f)
                rel_p = os.path.relpath(full_p, script_dir)
                zf.write(full_p, rel_p.replace("\\", "/"))

    print("=== Step 7: Aligning APK with zipalign ===")
    aligned_apk = os.path.join(build_dir, "aligned.apk")
    run_cmd(f'"{zipalign}" -f -p 4 "{unaligned_apk}" "{aligned_apk}"')

    print("=== Step 8: Signing APK with release.keystore ===")
    keystore = os.path.join(script_dir, "release.keystore")
    target_apk = os.path.join(script_dir, "suechef.apk")
    run_cmd(f'"{apksigner}" sign --ks "{keystore}" --ks-pass pass:suechef2026 --key-pass pass:suechef2026 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "{target_apk}" "{aligned_apk}"')

    # Verify signature
    out = run_cmd(f'"{apksigner}" verify --verbose "{target_apk}"')
    print(f"Signature Verification:\n{out}")

    # Copy to root
    root_apk = os.path.join(root_dir, "suechef.apk")
    shutil.copy2(target_apk, root_apk)
    print(f"\nSUCCESS! Standalone APK packaged and signed at:")
    print(f"  {target_apk} ({os.path.getsize(target_apk):,} bytes)")
    print(f"  {root_apk} ({os.path.getsize(root_apk):,} bytes)")

if __name__ == "__main__":
    build_apk()

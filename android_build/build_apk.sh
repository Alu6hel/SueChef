#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$DIR")"

echo "=== Building SueChef Standalone Native Android APK ==="

ANDROID_JAR="/home/davidalujones/Android/Sdk/platforms/android-36/android.jar"
BUILD_TOOLS="/home/davidalujones/Android/Sdk/build-tools/36.1.0"
AAPT2="$BUILD_TOOLS/aapt2"
D8="$BUILD_TOOLS/d8"
ZIPALIGN="$BUILD_TOOLS/zipalign"
APKSIGNER="$BUILD_TOOLS/apksigner"

# 1. Build Vite Web Frontend
echo "[1/7] Building Frontend Distribution Assets..."
cd "$ROOT_DIR"
npm run build

echo "[2/7] Copying Web Assets to Android Assets Directory..."
rm -rf "$DIR/assets"
mkdir -p "$DIR/assets"
cp -r "$ROOT_DIR/dist/"* "$DIR/assets/"

# 2. Compile Resources with AAPT2
echo "[3/7] Compiling Android Resources with AAPT2..."
mkdir -p "$DIR/build/compiled_res"
"$AAPT2" compile --dir "$DIR/res" -o "$DIR/build/compiled_res.zip"

echo "[4/7] Linking Android Resources..."
mkdir -p "$DIR/build/gen"
"$AAPT2" link "$DIR/build/compiled_res.zip" \
  -I "$ANDROID_JAR" \
  --manifest "$DIR/AndroidManifest.xml" \
  --java "$DIR/build/gen" \
  -o "$DIR/build/resources.apk" \
  --auto-add-overlay

# 3. Compile Java Source
echo "[5/7] Compiling Java Sources..."
mkdir -p "$DIR/build/classes"
javac -encoding UTF-8 \
  -cp "$ANDROID_JAR" \
  -d "$DIR/build/classes" \
  $(find "$DIR/src" -name "*.java") \
  "$DIR/build/gen/com/suechef/app/R.java"

# 4. Convert Bytecode to DEX with D8
echo "[6/7] Converting Bytecode to DEX with D8..."
mkdir -p "$DIR/build/dex"
"$D8" --output "$DIR/build/dex" \
  --lib "$ANDROID_JAR" \
  $(find "$DIR/build/classes" -name "*.class")

# 5. Package & Align APK
echo "[7/7] Packaging, Aligning & Signing APK..."
cp "$DIR/build/resources.apk" "$DIR/build/unaligned.apk"
cd "$DIR/build/dex"
zip -u "$DIR/build/unaligned.apk" classes.dex
cd "$DIR"
zip -ur "$DIR/build/unaligned.apk" assets/

"$ZIPALIGN" -f -p 4 "$DIR/build/unaligned.apk" "$DIR/build/aligned.apk"

# Ensure production release keystore exists
KEYSTORE="$DIR/release.keystore"
if [ ! -f "$KEYSTORE" ]; then
  echo "Generating production PKCS12 release keystore..."
  keytool -genkeypair -v -keystore "$KEYSTORE" -storetype PKCS12 \
    -alias suechef -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass suechef2026 -keypass suechef2026 \
    -dname "CN=SueChef Production,O=Alumungandr,C=US"
fi

"$APKSIGNER" sign --ks "$KEYSTORE" --ks-pass pass:suechef2026 --key-pass pass:suechef2026 \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$DIR/suechef.apk" "$DIR/build/aligned.apk"

echo "Verifying APK signatures..."
"$APKSIGNER" verify --verbose "$DIR/suechef.apk"

cp -f "$DIR/suechef.apk" "$ROOT_DIR/suechef.apk"

echo "=== SUCCESS! Standalone Android APK created at: $DIR/suechef.apk and $ROOT_DIR/suechef.apk ==="
ls -lh "$DIR/suechef.apk" "$ROOT_DIR/suechef.apk"

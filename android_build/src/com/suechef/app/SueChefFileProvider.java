package com.suechef.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

public class SueChefFileProvider extends ContentProvider {
    public static final String AUTHORITY = "com.suechef.app.fileprovider";

    public static Uri getUriForFile(File file) {
        return Uri.parse("content://" + AUTHORITY + "/" + file.getName());
    }

    @Override
    public boolean onCreate() {
        return true;
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        if (getContext() == null) throw new FileNotFoundException("Context is null");
        File cacheDir = getContext().getCacheDir();
        File file = new File(cacheDir, uri.getLastPathSegment());
        if (!file.exists()) {
            File extDir = getContext().getExternalFilesDir(null);
            if (extDir != null) {
                file = new File(extDir, uri.getLastPathSegment());
            }
        }
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + uri.getPath());
        }
        return ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        if (getContext() == null) return null;
        File cacheDir = getContext().getCacheDir();
        File file = new File(cacheDir, uri.getLastPathSegment());
        if (!file.exists()) {
            File extDir = getContext().getExternalFilesDir(null);
            if (extDir != null) {
                file = new File(extDir, uri.getLastPathSegment());
            }
        }
        MatrixCursor cursor = new MatrixCursor(new String[]{
            OpenableColumns.DISPLAY_NAME,
            OpenableColumns.SIZE
        });
        cursor.addRow(new Object[]{file.getName(), file.length()});
        return cursor;
    }

    @Override
    public String getType(Uri uri) {
        String path = uri.getPath();
        if (path != null) {
            if (path.endsWith(".pdf")) return "application/pdf";
            if (path.endsWith(".txt")) return "text/plain";
            if (path.endsWith(".csv")) return "text/csv";
            if (path.endsWith(".ics")) return "text/calendar";
            if (path.endsWith(".json") || path.endsWith(".suechef") || path.endsWith(".vault")) return "application/json";
            if (path.endsWith(".png")) return "image/png";
            if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        }
        return "application/octet-stream";
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) { return null; }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) { return 0; }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) { return 0; }
}

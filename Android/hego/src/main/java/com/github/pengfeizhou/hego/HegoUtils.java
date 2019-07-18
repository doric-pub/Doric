package com.github.pengfeizhou.hego;

import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoUtils {
    public static String readAssetFile(String assetFile) {
        InputStream inputStream = null;
        try {
            AssetManager assetManager = Hego.application().getAssets();
            inputStream = assetManager.open(assetFile);
            int length = inputStream.available();
            byte[] buffer = new byte[length];
            inputStream.read(buffer);
            return new String(buffer);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return "";
    }
}

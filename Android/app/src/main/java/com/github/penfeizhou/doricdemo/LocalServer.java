package com.github.penfeizhou.doricdemo;

import android.content.Context;
import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;

import fi.iki.elonen.NanoHTTPD;

/**
 * @Description: com.github.penfeizhou.doricdemo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-08-03
 */
public class LocalServer extends NanoHTTPD {
    private final Context context;

    public LocalServer(Context context, int port) {
        super(port);
        this.context = context;
    }

    @Override
    public Response serve(IHTTPSession session) {
        String url = session.getUri();
        if (url.startsWith("/assets/")) {
            String fileName = url.substring("/assets/".length());
            AssetManager assetManager = context.getAssets();
            try {
                InputStream inputStream = assetManager.open(fileName);
                return newFixedLengthResponse(Response.Status.OK, "text/plain", inputStream, inputStream.available());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return newFixedLengthResponse(NanoHTTPD.Response.Status.OK, "text/html", "HelloWorld");
    }
}

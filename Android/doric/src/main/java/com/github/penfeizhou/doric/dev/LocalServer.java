package com.github.penfeizhou.doric.dev;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;
import android.webkit.MimeTypeMap;

import java.io.IOException;
import java.io.InputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

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

    private static String getIpAddressString() {
        try {
            for (Enumeration<NetworkInterface> enNetI = NetworkInterface
                    .getNetworkInterfaces(); enNetI.hasMoreElements(); ) {
                NetworkInterface netI = enNetI.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = netI
                        .getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (inetAddress instanceof Inet4Address && !inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return "0.0.0.0";
    }

    @Override
    public void start() throws IOException {
        super.start();
        Log.d("Debugger", String.format("Open http://%s:8910/debugger.html to start debug", getIpAddressString()));
    }

    @Override
    public Response serve(IHTTPSession session) {
        String url = session.getUri();
        String fileName = url.substring(1);
        AssetManager assetManager = context.getAssets();
        try {
            InputStream inputStream = assetManager.open("debugger/" + fileName);
            String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileName.substring(fileName.lastIndexOf(".") + 1));
            return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, mimeType, inputStream, inputStream.available());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return NanoHTTPD.newFixedLengthResponse(NanoHTTPD.Response.Status.OK, "text/html", "HelloWorld");
    }
}

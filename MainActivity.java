public class MainActivity extends AppCompatActivity {
    private TextToSpeech tts;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                tts.setLanguage(Locale.UK);
            }
        });

        WebView webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidTTS");

        webView.loadUrl("file:///android_asset/index.html"); // or your live URL
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void speakText(String text) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null);
        }
    }
}

webView.addJavascriptInterface(new WebAppInterface(), "AndroidTTS");

@JavascriptInterface
public void speakText(String text) {
    Toast.makeText(context, "Speaking: " + text, Toast.LENGTH_SHORT).show();  // 'context' from constructor
    tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null);
}
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "MakerSpace_2.4G";
const char* password = "ntueesaad";

//Your Domain name with URL path or IP address with path
const char* serverName = "https://iot-term-project-server.onrender.com/messages";

unsigned long timerDelay = 10000;

const int capacity = JSON_OBJECT_SIZE(8) + JSON_ARRAY_SIZE(15);
StaticJsonDocument<capacity> doc;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  //Check WiFi connection status
  if(WiFi.status()== WL_CONNECTED){
    WiFiClient client;
    HTTPClient http;
  
    // Your Domain name with URL path or IP address with path
    http.begin(client, serverName);
    
    // If you need an HTTP request with a content type: application/json, use the following:
    http.addHeader("Content-Type", "application/json");

    doc["messageType"] = 0;
    doc["water"] = 10;
    doc["electricity"] = -1;
    doc["ToFStatus"] = 0x00;
    doc["senderId"] = "64:45:63:7e:dc:0c";
    doc["battery"] = 100;
    JsonArray path = doc.createNestedArray("path");
    path.add("64:45:63:7e:dc:c");

    String msg;
    serializeJson(doc, msg);
//    int httpResponseCode = http.POST("{\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");
    int httpResponseCode = http.POST(msg);
  
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
      
    // Free resources
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
  
  delay(timerDelay);
}

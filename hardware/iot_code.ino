// oled monitor
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define NUMFLAKES     10 // Number of snowflakes in the animation example

#define LOGO_HEIGHT   16
#define LOGO_WIDTH    16
static const unsigned char PROGMEM logo_bmp[] =
{ B00000000, B11000000,
  B00000001, B11000000,
  B00000001, B11000000,
  B00000011, B11100000,
  B11110011, B11100000,
  B11111110, B11111000,
  B01111110, B11111111,
  B00110011, B10011111,
  B00011111, B11111100,
  B00001101, B01110000,
  B00011011, B10100000,
  B00111111, B11100000,
  B00111111, B11110000,
  B01111100, B11110000,
  B01110000, B01110000,
  B00000000, B00110000
};

// wifi connection
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// buzzer sensor
int freq = 2000;
int channel = 0;
int resolution = 8;




// micro servo
#include <Servo.h>
static const int servoPin = 4;
Servo servo1;
bool status_ser = false;

int posDegrees = 0;

// dht section
#include "DHT.h"
#define DHTTYPE DHT11
#define dht_dpin 25
DHT dht(dht_dpin, DHTTYPE);

// mq9 section
#define pin_analog 26
#define pin_digital 18

// http send data
#include <HTTPClient.h>
#include <ArduinoJson.h>
const char* url = "http://158.108.182.6:3000/update?room=kitchen";
char str[100];
const int _size = 2 * JSON_OBJECT_SIZE(3);
StaticJsonDocument<_size> JSONPost;
StaticJsonDocument<_size> JSONGet;

void _post(double temperature, double humidity, double lpg, double ch4, double co, double h2)
{
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    JSONPost["temperature"] = temperature;
    JSONPost["humidity"] = humidity;
    JSONPost["lpg"] = lpg;
    JSONPost["co"] = co;
    JSONPost["ch4"] = ch4;
    JSONPost["h2"] = h2;
    serializeJson(JSONPost, str);
    int httpCode = http.POST(str);
    delay(1000);
    if (httpCode < 500) {
      String payload = http.getString();
      // Serial.println(httpCode);
      // Serial.println(payload);
    } else {
      // Serial.println("ERROR on HTTP Request");
    }
  }
}
// http get data

const char* url_get = "http://158.108.182.6:3000/switch_status?room=kitchen";
const char* url_get_q = "http://158.108.182.6:3000/find_quality?room=kitchen";
void _get() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(url_get);
    int httpCode = http.GET();

    if (httpCode = HTTP_CODE_OK) {
      String payload = http.getString();
      DeserializationError err = deserializeJson(JSONGet, payload);
      if (err) {
        // Serial.print(F("deserializeJson() failed with code"));
        // Serial.println(err.c_str());
      }
      else {
        // Serial.println(httpCode);
        // Serial.println("Get success");
      }
    }
    String payload = http.getString();
    // Serial.println(httpCode);
  }
}

void _getq() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(url_get_q);
    int httpCode = http.GET();

    if (httpCode = HTTP_CODE_OK) {
      String payload = http.getString();
      DeserializationError err = deserializeJson(JSONGet, payload);
      if (err) {
        // Serial.print(F("deserializeJson() failed with code"));
        // Serial.println(err.c_str());
      }
      else {
        // Serial.println(httpCode);
        // Serial.println("Get success");
      }
    }
    String payload = http.getString();
    // Serial.println(httpCode);
  }
}

void setup() {
  Serial.begin(9600);

  // wifi represent connection
  WiFi.begin("MSI_ING", "1234567890");
  //  WiFi.begin("kladee_home2G", "2011948483");
  //  WiFi.begin("18+", "toffy2544");
  // Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    // Serial.print(".");
  }
  // Serial.println();
  // Serial.print("Connected, IP address: ");
  // Serial.println(WiFi.localIP());
  delay(1000);


  // dht setup
  dht.begin();
  //  // Serial.println("Humidity and temperature\n\n");


  //buzzer setup
  ledcSetup(channel, freq, resolution);
  ledcAttachPin(14, channel);
  delay(300);

  //micro servo setuup
  servo1.attach(servoPin);
  delay(50);

  // oled setup

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    // Serial.println(F("SSD1306 allocation failed"));
    for (;;); // Don't proceed, loop forever
  }
  display.display();
  delay(2000);
  display.clearDisplay();
  display.drawPixel(10, 10, SSD1306_WHITE);
  display.display();

  delay(700);
}

void print_mq(String name, double value, int decimal)
{
  // Serial.print(name);
  // Serial.print(value, decimal);
  // Serial.println(" ppm");
}

void loop() {

  // from dht loop
  float f = dht.readTemperature(true);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  // Serial.print("Current humidity = ");
  // Serial.print(h);
  // Serial.print("%  ");
  // Serial.print("temperature = ");
  // Serial.print(t);
  // Serial.println("C  ");
  delay(500);
  //

  // from mq9 loop
  double sensor_volt;
  double RS_air; //  Rs in clean air
  double R0;  // R0 in 1000 ppm LPG
  double sensorValue;

  for (int x = 0 ; x < 100 ; x++)
  {
    sensorValue = sensorValue + analogRead(pin_analog);
  }
  sensorValue = sensorValue / 100.0;
  sensor_volt = (sensorValue / 1024) * 5.0;
  //  RS_air = (5.0 - sensor_volt) / sensor_volt;
  //  R0 = RS_air / 9.9;
  RS_air = ((5.0 - sensor_volt) / sensor_volt) * -1;
  R0 = RS_air / 9.9;
  //  double ch4 = (RS_air * 0.00017) / 100.000;
  //  double co = 5 * RS_air;
  //  double h2 = RS_air * 0.0002;
  double ch4 = (RS_air * 0.00017) / 100.000;
  double co = 5 * RS_air;
  double h2 = RS_air * 0.0002;

  // Serial.print("sensor_volt = ");
  // Serial.print(sensor_volt);
  // Serial.println(" V");

  _post(t, h, R0, ch4, co, h2);
  delay(1000);
  print_mq("Air = ", RS_air, 3);
  print_mq("LPG = ", R0, 3);
  print_mq("CH4 = ", ch4, 9);
  print_mq("CO = ", co, 3);
  print_mq("H2 = ", h2, 9);
  // Serial.println();
  delay(300);

  // get data to noticfy and open window

  _get();
  bool r = JSONGet["result"];
  //  // Serial.println(JSONGet["quality"]);
  _getq();
  bool q = JSONGet["qualityBL"];


   if (q) {
    ledcWriteTone(channel, 200);

    for (int dutyCycle = 0; dutyCycle <= 255; dutyCycle = dutyCycle + 50) {
      ledcWrite(channel, dutyCycle);
      delay(500);
    }
  }
  else{
    ledcWriteTone(channel, 0);
  }

  if (r and status_ser == false) {
    //   open
    for(int posDegrees = 0; posDegrees <= 89; posDegrees++) {
        servo1.write(posDegrees);
        Serial.println(posDegrees);
        delay(20);
    }
    status_ser = true;
  }

  if (r == false and status_ser) {
    // close
    for(int posDegrees = 89; posDegrees >= 0; posDegrees--) {
        servo1.write(posDegrees);
        Serial.println(posDegrees);
        delay(20);
    }
    status_ser = false;
  }
  // Serial.printf("debug3 %d %d , pos: %d", r, status_ser, posDegrees);

  //  // Serial.println("Everything is fine!");

  //  ledcWriteTone(channel, 0);
  // Serial.println("End section!\n");


    // oled represent
    if (isnan(h) || isnan(t) || isnan(f)) {
      delay(200);
    } else {
      // routine for converting temp/hum floats to char arrays
      char temp_buff[5]; char hum_buff[5];
      char temp_disp_buff[11] = "Tmp:";
      char hum_disp_buff[11] = "Hum:";
  
      // appending temp/hum to buffers
      dtostrf(t, 2, 1, temp_buff);
      strcat(temp_disp_buff, temp_buff);
      dtostrf(h, 2, 1, hum_buff);
      strcat(hum_disp_buff, hum_buff);
  
      // routine for displaying text for temp/hum readout
      display.clearDisplay();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.setCursor(0, 0);
      display.println(temp_disp_buff);
      display.println(hum_disp_buff);
      display.display();
      testanimate(logo_bmp, LOGO_WIDTH, LOGO_HEIGHT); // Animate bitmaps
      // gas sensor
      // gas sensor
      delay(500);
      char lpg_buff[5]; char co_buff[5]; char ch4_buff[5]; char h2_buff[5];
      char lpg_disp_buff[11] = "LPG:";
      char co_disp_buff[11] = "CO:";
      char ch4_disp_buff[11] = "LPG:";
      char h2_disp_buff[11] = "CO:";
      dtostrf(R0, 4, 2, lpg_buff);
      strcat(lpg_disp_buff, lpg_buff);
      dtostrf(co, 4, 2, co_buff);
      strcat(co_disp_buff, co_buff);
      dtostrf(ch4, 4, 2, ch4_buff);
      strcat(ch4_disp_buff, ch4_buff);
      dtostrf(h2, 4, 2, h2_buff);
      strcat(h2_disp_buff, h2_buff);
  
      display.clearDisplay();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.setCursor(0, 0);
      display.println(lpg_disp_buff);
      display.println(co_disp_buff);
      display.println(h2_disp_buff);
      display.println(ch4_disp_buff);
      display.display();
      
    }
  
  
    testanimate(logo_bmp, LOGO_WIDTH, LOGO_HEIGHT); // Animate bitmaps
    delay(500);
  }
  
  // star fall for oled
  
  #define XPOS   0 // Indexes into the 'icons' array in function below
  #define YPOS   1
  #define DELTAY 2
  
  void testanimate(const uint8_t *bitmap, uint8_t w, uint8_t h) {
    int8_t f, icons[NUMFLAKES][3];
  
    // Initialize 'snowflake' positions
    for (f = 0; f < NUMFLAKES; f++) {
      icons[f][XPOS]   = random(1 - LOGO_WIDTH, display.width());
      icons[f][YPOS]   = -LOGO_HEIGHT;
      icons[f][DELTAY] = random(1, 6);
      //    // Serial.print(F("x: "));
      //    // Serial.print(icons[f][XPOS], DEC);
      //    // Serial.print(F(" y: "));
      //    // Serial.print(icons[f][YPOS], DEC);
      //    // Serial.print(F(" dy: "));
      //    // Serial.println(icons[f][DELTAY], DEC);
    }
  
    for (int 
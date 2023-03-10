from time import sleep

from SX127x.LoRa import *
from SX127x.board_config import BOARD
# note: BOARD is modified, DIO0->25, RST->24

from getmac import get_mac_address as gma

import sys
import requests
import json
baseUrl = "https://iot-term-project-server.onrender.com/messages"

BOARD.setup()
print("board setup!!!")
MAC_ADDR = gma().upper()
print("Mac Address: ")
print(MAC_ADDR)


class LoRaRcvCont(LoRa):

    def __init__(self, verbose=True):
        super(LoRaRcvCont, self).__init__(verbose)
        self.set_mode(MODE.SLEEP)
        self.set_dio_mapping([0] * 6)

    def start(self):

        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT)
        while True:
            sleep(.5)
            rssi_value = self.get_rssi_value()
            status = self.get_modem_status()
            sys.stdout.flush()

    def on_rx_done(self):
        print("\nReceived: ")
        self.clear_irq_flags(RxDone=1)
        payload = self.read_payload(nocheck=True)
        try:
            payload = json.loads(bytes(payload).decode("utf-8",'ignore'))
            payload["path"].append(MAC_ADDR)
            print(payload)
            res = requests.post(baseUrl, json=payload, timeout=2.5)
            print(res.status_code)
            if res.status_code != 200:
                print(res.text)
        except:
            print(payload)
            print(type(payload))
        self.set_mode(MODE.SLEEP)
        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT) 


lora = LoRaRcvCont(verbose=True)
lora.set_mode(MODE.STDBY)

lora.set_freq(433.0)

#  Medium Range  Defaults after init are 434.0MHz, Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC on 13 dBm
lora.set_pa_config(pa_select=1)

try:
    lora.start()
except KeyboardInterrupt:
    sys.stdout.flush()
    print("")
    sys.stderr.write("KeyboardInterrupt\n")
finally:
    sys.stdout.flush()
    print("")
    lora.set_mode(MODE.SLEEP)
    BOARD.teardown()

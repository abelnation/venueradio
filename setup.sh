#!/bin/sh

/usr/local/bin/virtualenv -p /usr/local/bin/python2.7 --distribute venueradio-env-2.7
source ./venueradio-env-2.7/bin/activate

pip install requests
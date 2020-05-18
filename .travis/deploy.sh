#!/bin/bash
set -e 
scp -rpi deploy_rsa build Dev@138.91.114.14:~/FrontEndScript
ssh -i deploy_rsa Dev@138.91.114.14 'cd ~/FrontEndScript && ./reload.sh'
exit

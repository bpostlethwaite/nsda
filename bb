#!/bin/bash
#
# Uses .service.files for newline separated list of
# services to start
# and the tmp file .service.pids to keep track of
# their process IDs when started to kill them
# on the stop command.

USAGE="usage: $0 [start|stop]"

if [ "$#" -ne 1 ]
then
    echo $USAGE

elif [ "$1" = "start" ]
then
    :>.service.pids # truncate servicePID file
    while read service; do
        node $service &
        echo "starting" $service
        echo $service $! >> .service.pids
    done < .service.files

#    (ps -ef | grep " $$ " | grep -v $0 | grep -v grep | awk '{ print $2 }') > .service.pids

elif [ $1 = "stop" ]
then
    while read line; do
        service=$(echo $line | awk '{ print $1 }')
        pid=$(echo $line | awk '{ print $2 }')
        echo "stopping" $service
        kill $pid
    done < .service.pids

else
    echo $USAGE
fi

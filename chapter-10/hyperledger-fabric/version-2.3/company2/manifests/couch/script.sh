#!/bin/bash

CONDITION=$1

#Deploy Services
kubectl ${CONDITION} -f .
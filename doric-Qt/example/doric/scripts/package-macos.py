#!/usr/bin/env python
# -*- coding:utf-8 -*-
import os
import sys
import time
import platform
import shutil
import glob
import requests
import json
import zipfile
  
def system(command):
    retcode = os.system(command)
    if retcode != 0:
        raise Exception("Error while executing:\n\t %s" % command)
def main():
    version = "0.0.0"
    isOnline = "0"
    paramlen = len(sys.argv)
    if paramlen == 3:
       version = sys.argv[1]
       isOnline = sys.argv[2]
       print("version:"+str(version)+" isOnline:"+str(isOnline))
    elif paramlen == 2:
       version = sys.argv[1]
       print("version:"+str(version))
    elif paramlen == 1:
       print("version:"+str(version)+" isOnline:"+str(isOnline))
    else:
       print("params error.");
       return;
    system('conan export-pkg ./conanfile-macos-debug.py DoricCore/%s@bixin/stable -s build_type=Debug -s os=Macos' % version)
    system('conan export-pkg ./conanfile-macos-release.py DoricCore/%s@bixin/stable -s build_type=Release -s os=Macos' % version)
    if isOnline == "1":
       system('conan upload DoricCore/%s@bixin/stable --all -r=pc' % version)
       system('git tag %s' % version)
       system('git push --tags')
if __name__ == "__main__":
    main()

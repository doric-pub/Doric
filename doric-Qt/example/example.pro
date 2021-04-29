TEMPLATE = subdirs
CONFIG += ordered
SUBDIRS = doric \
          app
doric.subdir = $$PWD/doric
app.subdir = $$PWD/app
app.depends = doric

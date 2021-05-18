#ifndef DORICEXPORT_H
#define DORICEXPORT_H

#if defined(DORIC_LIBRARY)
#  define DORIC_EXPORT Q_DECL_EXPORT
#else
#  define DORIC_EXPORT Q_DECL_IMPORT
#endif

#endif // DORICEXPORT_H

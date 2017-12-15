import _linkbot

class Accelerometer:
    def __init__(self, linkbot):
        self.__linkbot = linkbot

    def set_event_handler(callback=None, granularity=0x05):
        raise NotImplementedError('set_event_handler not implemented.')

    def values():
        return self.__linkbot.get_accelerometer()

    def x():
        return self.__linkbot.get_accelerometer[0]

    def y():
        return self.__linkbot.get_accelerometer[1]

    def z():
        return self.__linkbot.get_accelerometer[2]

class Linkbot(_linkbot._Linkbot):
    def __init__(self, serial_id):
        _linkbot._Linkbot.__init__(self, serial_id)  


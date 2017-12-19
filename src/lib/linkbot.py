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

class Battery:
    def __init__(self, linkbot):
        self.__linkbot = linkbot

    def percentage(self):
        raise NotImplementedError("Method not implemented.")

    def voltage(self):
        raise NotImplementedError("Method not implemented.")

class Buttons:
    def __init__(self, linkbot):
        self.__linkbot = linkbot

    def a(self):
        raise NotImplementedError("Method not implemented.")

    def b(self):
        raise NotImplementedError("Method not implemented.")

    def pwr(self):
        raise NotImplementedError("Method not implemented.")

    def set_event_handler(callback=None):
        self.__linkbot.set_button_callback(callback)

class Buzzer:
    def __init__(self, linkbot):
        self.__linkbot = linkbot

    def frequency(self):
        raise NotImplementedError("Method not implemented.")

    def set_frequency(self, frequency):
        return self.__linkbot.set_buzzer_frequency(frequency)

class Led:
    def __init__(self, linkbot):
        self.__linkbot = linkbot

    def color():
        raise NotImplementedError("Method not implemented.")

    def set_color(self, r, g, b):
        return self.__linkbot.set_led_color(r, g, b)

    def set_color_code(self, code):
        return self.__linkbot.set_led_color_rgb(code)

class Motor:
    class Controller:
        PID = 1
        CONST_VEL = 2
        SMOOTH = 3
        ACCEL = 4

    class State:
        COAST = 0
        HOLD = 1
        MOVING = 2
        ERROR = 4

    def __init__(self, linkbot, index):
        self.__linkbot = linkbot
        self.__index = index

    def accel(self):
        raise NotImplementedError("Method not implemented.")

    def angle(self):
        return self.__linkbot.get_joint_angle(self.__index)

    def begin_accel(self, timeout, v0=0.0, state_on_timeout=State.COAST):
        raise NotImplementedError("Method not implemented.")

    def begin_move(self, timeout=0, forward=True, state_on_timeout=State.COAST):
        raise NotImplementedError("Method not implemented.")

    def controller(self):
        raise NotImplementedError("Method not implemented.")

    def decel(self):
        raise NotImplementedError("Method not implemented.")

    def move(self, angle, relative=True, wait=True):
        fn = None
        if relative:
            if wait:
                fn = self.__linkbot.move_joint
            else:
                fn = self.__linkbot.move_joint_nb
        else:
            if wait:
                fn = self.__linkbot.move_joint_to
            else:
                fn = self.__linkbot.move_joint_to_nb

        return fn(self.__index, angle)

    def move_wait(self):
        return self.__linkbot.move_joint_wait(self.__index)

    def omega(self):
        raise NotImplementedError("Method not implemented.")

    def set_power(self, power):
        return self.__linkbot.set_motor_power(self.__index, power)

class Motors:
    def __init__(self, linkbot):
        self.__linkbot = linkbot
        self.__motors = []
        for i in range(3):
            self.__motors.append(Motor(linkbot, i))

    def __getitem__(self, key):
        return self.__motors[key]

    def angles(self):
        return self.__linkbot.get_joint_angles()

    def begin_move(self, mask=0x07, timeouts=(0,0,0), forward=(True,True,True), states_on_timeout=(0,0,0), wait=True):
        raise NotImplementedError("Method not implemented.")

    def move(self, angles, mask=0x07, relative=True, timeouts=None, states_on_timeout=None, wait=True):
        raise NotImplementedError("Method not implemented.")

    def reset(self):
        return self.__linkbot.reset()

    def set_event_handler(self, callback, granularity=2.0):
        return self.__linkbot.set_encoder_callback(callback, granularity)

    def set_powers(powers, mask=0x07):
        return self.__linkbot.set_motor_powers(powers[0], powers[1], powers[2])

class Linkbot(_linkbot._Linkbot):
    def __init__(self, serial_id):
        _linkbot._Linkbot.__init__(self, serial_id)  

        self.accelerometer = Accelerometer(self)
        self.battery = Battery(self)
        self.buttons = Buttons(self)
        self.buzzer = Buzzer(self)
        self.led = Led(self)
        self.motors = Motors(self)


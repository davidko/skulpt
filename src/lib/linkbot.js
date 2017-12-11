var $builtinmodule = function (name) {
"use strict";

    var mod = {};

    function _Linkbot() {
    }

    (function(proto) {
        // Getters

        proto.$get_accelerometer = function() {
            return this.inner.getAccelerometer();
        };

        proto.$get_joint_angle = function(joint) {
            return this.inner.getJointAngle(joint);
        };

        proto.$get_joint_angles = function() {
            return this.inner.getJointAngles();
        };

        // Movement
       
        proto.$drive_angle = function(angle) {
            return this.inner.driveAngle(angle);
        };
      
        proto.$drive_distance = function(distance, radius) {
            return this.inner.driveDistance(distance, radius);
        };

        proto.$drive_distance_nb = function(distance, radius) {
            return this.inner.driveDistanceNB(distance, radius);
        };
        
        proto.$move = function(angle1, angle2, angle3) {
            return this.inner.move(angle1, angle2, angle3);
        };

        proto.$move_nb = function(angle1, angle2, angle3) {
            return this.inner.moveNB(angle1, angle2, angle3);
        };

        proto.$move_to = function(angle1, angle2, angle3) {
            return this.inner.moveTo(angle1, angle2, angle3);
        };

        proto.$move_to_nb = function(angle1, angle2, angle3) {
            return this.inner.moveToNB(angle1, angle2, angle3);
        };

        proto.$move_joint = function(joint, angle) {
            return this.inner.moveJoint(joint, angle);
        };

        proto.$move_joint_nb = function(joint, angle) {
            return this.inner.moveJointNB(joint, angle);
        };

        proto.$move_joint_to = function(joint, angle) {
            return this.inner.moveJointTo(joint, angle);
        };

        proto.$move_joint_to_nb = function(joint, angle) {
            return this.inner.moveJointToNB(joint, angle);
        };

        proto.$reset = function() {
            return this.inner.reset();
        };

        proto.$reset_to_zero = function() {
            return this.inner.resetToZero();
        };

        proto.$reset_to_zero_nb = function() {
            return this.inner.resetToZeroNB();
        };

        proto.$stop = function() {
            return this.inner.stop();
        };

        proto.$turn_angle = function(angle, radius, trackLength) {
            return this.inner.turnAngle(angle, radius, trackLength);
        };

        proto.$turn_angle_nb = function(angle, radius, trackLength) {
            return this.inner.turnAngleNB(angle, radius, trackLength);
        };

        proto.$move_wait = function() {
            return this.inner.moveWait();
        };

        // Setters

        proto.$set_buzzer_frequency = function(frequency) {
            return this.inner.setBuzzerFrequency(frequency);
        };

        proto.$set_joint_speed = function(joint, speed) {
            return this.inner.setMotorSpeeds(speed, speed, speed, 1<<joint);
        };

        proto.$set_joint_speeds = function(speed1, speed2, speed3) {
            return this.inner.setMotorSpeeds(speed1, speed2, speed3);
        };

        proto.$set_led_color = function(r, g, b) {
            return this.inner.setLedColor(r, g, b);
        };

        proto.$set_led_color_rgb = function(color_code) {
            return this.inner.setLedColorRgb(color_code);
        };

        proto.$set_motor_power = function(joint, power) {
            return this.inner.setMotorPowers(power, power, power, 1<<joint);
        };

        proto.$set_motor_powers = function(power1, power2, power3) {
            return this.inner.setMotorPowers(power1, power2, power3);
        };

    })(_Linkbot.prototype);

    // InstantPromise is a workaround to allow usage of the clean promise-style
    // then/catch syntax but to instantly call resolve the then/catch chain so we
    // can avoid creating Suspensions in unnecessary cases.  This is desirable
    // because Suspensions have a fairly large negative impact on overall
    // performance.  These 'instant promises' come into play when a tracer()
    // call is made with a value other than 1.  When tracer is 0 or greater than 1
    // , we can bypass the creation of a Suspension and proceed to the next line of
    // code immediately if the current line is not going to incur involve a screen
    // update. We determine if a real promise or InstantPromise is necessary by
    // checking FrameManager.willRenderNext()
    function InstantPromise() {
        this.lastResult = undefined;
        this.lastError  = undefined;
    }

    InstantPromise.prototype.then = function(cb) {
        if (this.lastError) {
            return this;
        }

        try {
         this.lastResult = cb(this.lastResult);
        } catch(e) {
            this.lastResult = undefined;
            this.lastError  = e;
        }

        return this.lastResult instanceof Promise ? this.lastResult : this;
    };

    InstantPromise.prototype.catch = function(cb) {
        if (this.lastError) {
            try {
                this.lastResult = cb(this.lastError);
                this.lastError  = undefined;
            } catch(e) {
                this.lastResult = undefined;
                this.lastError = e;
            }
        }

        return this.lastResult instanceof Promise ? this.lastResult : this;
    };

    function addModuleMethod(klass, module, method, scopeGenerator) {
        var publicMethodName = method.replace(/^\$/, ""),
            displayName      = publicMethodName.replace(/_\$[a-z]+\$$/i, ""),
            maxArgs          = klass.prototype[method].length,
            minArgs          = klass.prototype[method].minArgs,
            keywordArgs      = klass.prototype[method].keywordArgs,
            returnType       = klass.prototype[method].returnType,
            isSk             = klass.prototype[method].isSk,
            wrapperFn;

        if (minArgs === undefined) {
            minArgs = maxArgs;
        }

        wrapperFn = function() {
            var args     = Array.prototype.slice.call(arguments, 0),
                instance = scopeGenerator ? scopeGenerator() : args.shift().instance,
                i, result, susp, resolution, lengthError;

            if (args.length < minArgs || args.length > maxArgs) {
                lengthError = minArgs === maxArgs ?
                    "exactly " + maxArgs :
                    "between " + minArgs + " and " + maxArgs;

                throw new Sk.builtin.TypeError(displayName + "() takes " + lengthError + " positional argument(s) (" + args.length + " given)");
            }

            for (i = args.length; --i >= 0;) {
                if (args[i] !== undefined) {
                    if (args[i] instanceof Sk.builtin.func) {
                        args[i] = pythonToJavascriptFunction(args[i]);
                    }
                    else if (args[i] instanceof Sk.builtin.method) {
                        args[i] = pythonToJavascriptFunction(args[i].im_func, args[i].im_self);
                    }
                    else if (args[i] && args[i].$d instanceof Sk.builtin.dict && args[i].instance) {
                        args[i] = args[i].instance;
                    }
                    else {
                        args[i] = Sk.ffi.remapToJs(args[i]);
                    }
                }
            }

            try {
                console.log("Trying to apply function...");
                console.log(instance);
                console.log(method);
                result = instance[method].apply(instance, args);
            } catch(e) {
                if (window && window.console) {
                    window.console.log("wrapped method failed");
                    window.console.log(e.stack);
                }
                throw e;
            }

            if (result instanceof InstantPromise) {
                result = result.lastResult;
            }

            if (result instanceof Promise) {
                result = result.catch(function(e) {
                    if (window && window.console) {
                        window.console.log("promise failed");
                        window.console.log(e.stack);
                    }
                    throw e;
                });

                susp = new Sk.misceval.Suspension();

                susp.resume = function() {
                    return (resolution === undefined) ?
                        Sk.builtin.none.none$ :
                        Sk.ffi.remapToPy(resolution);
                };

                susp.data = {
                    type: "Sk.promise",
                    promise: result.then(function(value) {
                        resolution = value;
                        return value;
                    })
                };

                return susp;
            }
            else {
                if (result === undefined) return Sk.builtin.none.none$;
                if (isSk) return result;
                if (typeof returnType === "function") {
                    return returnType(result);
                }

                return Sk.ffi.remapToPy(result);
            }
        };

        if (keywordArgs) {
            wrapperFn.co_varnames = keywordArgs.slice();
            // make room for required arguments
            for(var i = 0; i < minArgs; i++) {
                wrapperFn.co_varnames.unshift("");
            }
            if (!scopeGenerator) {
                // make room for the "self" argument
                wrapperFn.co_varnames.unshift("");
            }
        }

        module[publicMethodName] = new Sk.builtin.func(wrapperFn);
    }

    function LinkbotWrapper($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, serial_id) {
            self.instance = new _Linkbot();
            Sk.builtin.pyCheckArgs("__init__", arguments, 2, 2);
            serial_id = Sk.ffi.remapToJs(serial_id);
            var robot_promise = daemon.getRobot(serial_id);
            var susp = new Sk.misceval.Suspension();
            susp.resume = function() {
                if ( susp.data['error'] ) {
                    throw new Sk.builtin.RuntimeError('Could not connect to robot: ' + serial_id);
                } else {
                    return Sk.builtin.none.none$;
                }
            };
            susp.data = {
                type: "Sk.promise",
                promise: robot_promise.then(function(robot) {
                    self.instance.inner = robot;
                    return robot;
                })
            };
            return susp;
        });

        for(var key in _Linkbot.prototype) {
            if (/^\$[a-z_]+/.test(key)) {
                addModuleMethod(_Linkbot, $loc, key);
            }
        }
    };

    mod.Linkbot = Sk.misceval.buildClass(mod, LinkbotWrapper, "Linkbot", []);

    return mod;
};

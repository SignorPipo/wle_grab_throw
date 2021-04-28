
PP.EasyTuneWidget = class EasyTuneWidget {

    constructor() {
        this._myWidgetFrame = new PP.WidgetFrame("E", 1);
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));

        this._mySetup = new PP.EasyTuneWidgetSetup();
        this._myAdditionalSetup = null;

        this._myWidgets = [];

        this._myEasyTuneVariables = null;
        this._myEasyTuneLastSize = 0;
        this._myVariableNames = null;

        this._myCurrentWidget = null;
        this._myCurrentVariable = null;

        this._myScrollVariableTimer = 0;

        this._myRightGamepad = PP.RightGamepad; //@EDIT get right gamepad here based on how you store it in your game
        this._myLeftGamepad = PP.LeftGamepad; //@EDIT get left gamepad here based on how you store it in your game

        this._myGamepad = null;
        if (this._mySetup.myGamepadHandedness == PP.HandednessIndex.RIGHT) {
            this._myGamepad = this._myRightGamepad;
        } else if (this._mySetup.myGamepadHandedness == PP.HandednessIndex.LEFT) {
            this._myGamepad = this._myLeftGamepad;
        }
    }

    start(parentObject, additionalSetup, easyTuneVariables, startVariableName) {
        this._myAdditionalSetup = additionalSetup;

        this._myWidgetFrame.start(parentObject, additionalSetup);

        this._myEasyTuneVariables = easyTuneVariables;
        this._myEasyTuneLastSize = this._myEasyTuneVariables.size;
        this._myVariableNames = Array.from(this._myEasyTuneVariables.keys());

        if (this._myEasyTuneVariables.has(startVariableName)) {
            this._myCurrentVariable = this._myEasyTuneVariables.get(startVariableName);
        } else if (this._myEasyTuneVariables.size > 0) {
            this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[0]);
        }

        this._initializeWidgets();
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        if (this._myEasyTuneVariables.size != this._myEasyTuneLastSize) {
            this._refreshEasyTuneVariables();
        }

        if (this._myWidgetFrame.myIsWidgetVisible && this._myEasyTuneVariables.size > 0) {
            if (this._myCurrentWidget) {
                this._myCurrentWidget.update(dt);
            }
            this._updateGamepadScrollVariable(dt);
        }

        this._updateGamepadWidgetVisibility();
    }

    _initializeWidgets() {
        this._myWidgets[PP.EasyTuneVariableType.NONE] = new PP.EasyTuneNoneWidget();
        this._myWidgets[PP.EasyTuneVariableType.NUMBER] = new PP.EasyTuneNumberWidget(this._myGamepad, this._mySetup.myScrollVariableButtonType);

        for (let item of this._myWidgets) {
            item.start(this._myWidgetFrame.getWidgetObject(), this._myAdditionalSetup);
            item.setVisible(false);
            item.registerScrollVariableRequestEventListener(this, this._scrollVariable.bind(this));
        }

        this._selectCurrentWidget();
    }

    _selectCurrentWidget() {
        if (this._myEasyTuneVariables.size <= 0) {
            return;
        }

        if (this._myCurrentWidget) {
            this._myCurrentWidget.setVisible(false);
        }

        if (this._myCurrentVariable.myType in this._myWidgets) {
            this._myCurrentWidget = this._myWidgets[this._myCurrentVariable.myType];
            this._myCurrentWidget.setEasyTuneVariable(this._myCurrentVariable, this._createIndexString());
            this._myCurrentWidget.setVisible(this._myWidgetFrame.myIsWidgetVisible);
        } else {
            this._myCurrentWidget = this._myWidgets[PP.EasyTuneVariableType.NONE];
            this._myCurrentWidget.setEasyTuneVariable(this._myCurrentVariable, this._createIndexString());
            this._myCurrentWidget.setVisible(this._myWidgetFrame.myIsWidgetVisible);
        }
    }

    _refreshEasyTuneVariables() {
        this._myVariableNames = Array.from(this._myEasyTuneVariables.keys());
        this._myEasyTuneLastSize = this._myEasyTuneVariables.size;

        if (this._myEasyTuneVariables.size > 0) {
            if (this._myCurrentVariable && this._myEasyTuneVariables.has(this._myCurrentVariable.myName)) {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myCurrentVariable.myName);
            } else {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[0]);
            }

            this._selectCurrentWidget();
        } else {
            this._myCurrentVariable = null;
            if (this._myCurrentWidget) {
                this._myCurrentWidget.setVisible(false);
                this._myCurrentWidget = null;
            }
        }
    }

    _updateGamepadWidgetVisibility() {
        if (this._myGamepad) {
            if ((this._myGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) ||
                (this._myGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed)) {
                this._toggleVisibility();
            }
        }
    }

    _toggleVisibility() {
        this._myWidgetFrame.toggleVisibility();
    }

    _widgetVisibleChanged() {
        if (this._myCurrentWidget) {
            if (this._myEasyTuneVariables.size > 0) {
                this._myCurrentWidget.setVisible(this._myWidgetFrame.myIsWidgetVisible);
            } else {
                this._myCurrentWidget.setVisible(false);
            }
        }

        if (this._myWidgetFrame.myIsWidgetVisible) {
            this._refreshEasyTuneVariables();
        }
    }

    _updateGamepadScrollVariable(dt) {
        if (this._myGamepad && this._myGamepad.getButtonInfo(this._mySetup.myScrollVariableButtonType).myIsPressed) {
            let x = this._myGamepad.getAxesInfo().myAxes[0];
            if (Math.abs(x) > this._mySetup.myScrollVariableMinThreshold) {
                this._myScrollVariableTimer += dt;
                while (this._myScrollVariableTimer > this._mySetup.myScrollVariableDelay) {
                    this._myScrollVariableTimer -= this._mySetup.myScrollVariableDelay;
                    this._scrollVariable(Math.sign(x));
                }
            } else {
                this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
            }
        } else {
            this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
        }
    }

    _scrollVariable(amount) {
        if (this._myEasyTuneVariables.size <= 0) {
            return;
        }

        let variableIndex = this._getVariableIndex(this._myCurrentVariable);
        if (variableIndex >= 0) {
            let newIndex = (((variableIndex + amount) % this._myVariableNames.length) + this._myVariableNames.length) % this._myVariableNames.length; //manage negative numbers
            if (this._myEasyTuneVariables.has(this._myVariableNames[newIndex])) {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[newIndex]);
                this._selectCurrentWidget();
            } else {
                this._refreshEasyTuneVariables();
            }
        } else {
            this._refreshEasyTuneVariables();
        }
    }

    _createIndexString() {
        let indexString = " (";
        let index = (this._getVariableIndex(this._myCurrentVariable) + 1).toString();
        let length = (this._myEasyTuneVariables.size).toString();
        while (index.length < length.length) {
            index = "0".concat(index);
        }

        indexString = indexString.concat(index).concat(" - ").concat(length).concat(")");

        return indexString;
    }

    _getVariableIndex(variable) {
        let variableIndex = this._myVariableNames.indexOf(variable.myName);
        return variableIndex;
    }
};
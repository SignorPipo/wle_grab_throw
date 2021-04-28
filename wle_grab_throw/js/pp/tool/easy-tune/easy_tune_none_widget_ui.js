
PP.EasyTuneNoneWidgetUI = class EasyTuneNoneWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;
        this._myPlaneMesh = PP.MeshUtils.createPlaneMesh();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setVisible(visible) {
        if (visible) {
            this.myPivotObject.resetTransform();
            this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandednessIndex]);
        } else {
            this.myPivotObject.scale([0, 0, 0]);
            this.myPivotObject.setTranslationLocal([0, -7777, 0]);
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);

        this._createDisplaySkeleton();
        this._createPointerSkeleton();
    }

    _createDisplaySkeleton() {
        this.myDisplayPanel = WL.scene.addObject(this.myPivotObject);
        this.myDisplayBackground = WL.scene.addObject(this.myDisplayPanel);

        this.myVariableLabelPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myVariableLabelText = WL.scene.addObject(this.myVariableLabelPanel);

        this.myTypeNotSupportedPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myTypeNotSupportedText = WL.scene.addObject(this.myTypeNotSupportedPanel);

        //Next/Previous
        this.myNextButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myNextButtonBackground = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonText = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonCursorTarget = WL.scene.addObject(this.myNextButtonPanel);

        this.myPreviousButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myPreviousButtonBackground = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonText = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonCursorTarget = WL.scene.addObject(this.myPreviousButtonPanel);
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandednessIndex]);

        this._setDisplayTransforms();
        this._setPointerTransform();
    }

    _setDisplayTransforms() {
        this.myDisplayPanel.setTranslationLocal(this._mySetup.myDisplayPanelPosition);
        this.myDisplayBackground.scale(this._mySetup.myDisplayBackgroundScale);

        this.myVariableLabelPanel.setTranslationLocal(this._mySetup.myVariableLabelPanelPosition);
        this.myVariableLabelText.scale(this._mySetup.myVariableLabelTextScale);

        this.myTypeNotSupportedPanel.setTranslationLocal(this._mySetup.myTypeNotSupportedPanelPosition);
        this.myTypeNotSupportedText.scale(this._mySetup.myTypeNotSupportedTextScale);

        //Next/Previous
        this.myNextButtonPanel.setTranslationLocal(this._mySetup.myNextButtonPosition);
        this.myNextButtonBackground.scale(this._mySetup.myDisplayButtonBackgroundScale);
        this.myNextButtonText.setTranslationLocal(this._mySetup.myDisplayButtonTextPosition);
        this.myNextButtonText.scale(this._mySetup.myDisplayButtonTextScale);
        this.myNextButtonCursorTarget.setTranslationLocal(this._mySetup.myDisplayButtonCursorTargetPosition);

        this.myPreviousButtonPanel.setTranslationLocal(this._mySetup.myPreviousButtonPosition);
        this.myPreviousButtonBackground.scale(this._mySetup.myDisplayButtonBackgroundScale);
        this.myPreviousButtonText.setTranslationLocal(this._mySetup.myDisplayButtonTextPosition);
        this.myPreviousButtonText.scale(this._mySetup.myDisplayButtonTextScale);
        this.myPreviousButtonCursorTarget.setTranslationLocal(this._mySetup.myDisplayButtonCursorTargetPosition);
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this._addDisplayComponents();
        this._addPointerComponents();
    }

    _addDisplayComponents() {
        this.myDisplayBackgroundComponent = this.myDisplayBackground.addComponent('mesh');
        this.myDisplayBackgroundComponent.mesh = this._myPlaneMesh;
        this.myDisplayBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myDisplayBackgroundComponent.material.color = this._mySetup.myDisplayBackgroundColor;

        this.myVariableLabelTextComponent = this.myVariableLabelText.addComponent('text');
        this._setupTextComponent(this.myVariableLabelTextComponent);

        this.myTypeNotSupportedTextComponent = this.myTypeNotSupportedText.addComponent('text');
        this._setupTextComponent(this.myTypeNotSupportedTextComponent);
        this.myTypeNotSupportedTextComponent.text = this._mySetup.myTypeNotSupportedText;

        //Next/Previous
        this.myNextButtonBackgroundComponent = this.myNextButtonBackground.addComponent('mesh');
        this.myNextButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNextButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myNextButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myNextButtonTextComponent = this.myNextButtonText.addComponent('text');
        this._setupTextComponent(this.myNextButtonTextComponent);
        this.myNextButtonTextComponent.text = this._mySetup.myNextButtonText;

        this.myNextButtonCursorTargetComponent = this.myNextButtonCursorTarget.addComponent('cursor-target');
        this.myNextButtonCollisionComponent = this.myNextButtonCursorTarget.addComponent('collision');
        this.myNextButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myNextButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myNextButtonCollisionComponent.extents = this._mySetup.myDisplayButtonCollisionExtents;

        this.myPreviousButtonBackgroundComponent = this.myPreviousButtonBackground.addComponent('mesh');
        this.myPreviousButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPreviousButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPreviousButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myPreviousButtonTextComponent = this.myPreviousButtonText.addComponent('text');
        this._setupTextComponent(this.myPreviousButtonTextComponent);
        this.myPreviousButtonTextComponent.text = this._mySetup.myPreviousButtonText;

        this.myPreviousButtonCursorTargetComponent = this.myPreviousButtonCursorTarget.addComponent('cursor-target');
        this.myPreviousButtonCollisionComponent = this.myPreviousButtonCursorTarget.addComponent('collision');
        this.myPreviousButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPreviousButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPreviousButtonCollisionComponent.extents = this._mySetup.myDisplayButtonCollisionExtents;
    }

    _addPointerComponents() {
        this.myPointerCollisionComponent = this.myPointerCursorTarget.addComponent('collision');
        this.myPointerCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._mySetup.myPointerCollisionExtents;
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.outlineRange = this._mySetup.myTextOutlineRange;
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
        textComponent.text = "";
    }
};
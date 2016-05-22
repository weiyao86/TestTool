Ext.define('Ext.ux.component.field.ImageField', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.imagefield',
    isOpenView: true,
    fieldSubTpl: ['<img id="{id}" class="{fieldCls}" />', {
        compiled: true,
        disableFormats: true
    }],
    fieldCls: Ext.baseCSSPrefix + 'form-image-field',
    cdnPath: null,
    value: null,
    noImgFile: null,
    error: true,
    nopicPath:'',
    initEvents: function() {
        var me = this;

        me.callParent();

        me.inputEl.on('click', me.doClick, me);
    },

    doClick: function(e, o) {
        this.fireEvent('click', this, e);
    },

    setValue: function(v) {
        var me = this;

        me.callParent(arguments);
        me.error = true;
        me.loadImage();
    },

    onRender: function() {
        this.callParent(arguments);

        var me = this,
            name = me.name || Ext.id();

        me.hiddenField = me.inputEl.insertSibling({
            tag: 'input',
            type: 'hidden',
            name: name
        });
    },

    loadImage: function() {
        var me = this,
            img = Ext.fly(new Image());
        img.on('load', function() {
            me.error = false;
            me.handlerSuccess(this);
            if (me.isViewBagImage()) {
                me.setCursor();
            }
        }, img.dom, {
            single: true
        });

        img.on('error', function() {
            me.error = true;
            me.loadNoImage();
        }, img.dom, {
            single: true
        });

        if (me.value) {
            img.set({
                src: me.cdnPath + '/' + me.cdnFolder + '/' + me.value
            });
        } else {
            me.loadNoImage();
        }
    },

    handlerSuccess: function(that) {
        var me = this,
            parentSize = me.up().getSize(),
            rawSize = me.calculateAspectRatioFit(that.width, that.height, parentSize.width, parentSize.height);

        me.setSrc(that.src);
        me.setSize({
            width: rawSize.width,
            height: rawSize.height
        });
    },

    loadNoImage: function() {
        var me = this,
            img = Ext.fly(new Image());

        img.on('load', function() {
            me.handlerSuccess(this);
        }, img.dom, {
            single: true
        }).set({
            src: me.nopicPath + '/' + me.noImgFile
        });
    },

    calculateAspectRatioFit: function(srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio
        };
    },

    setSrc: function(src) {
        var me = this;

        me.inputEl.set({
            src: src
        });
    },

    isViewBagImage: function() {
        var me = this;

        if (!me.error && me.isOpenView) {
            return true;
        }

        return false;
    },

    setCursor: function() {
        var me = this;

        me.inputEl.setStyle('cursor', 'pointer');
    }
});
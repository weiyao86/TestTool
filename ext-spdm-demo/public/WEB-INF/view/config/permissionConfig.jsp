<!-- SPDM permisson Config -->
<script type="text/javascript">

    Ext.define("SPDM.permissonConfig", {
        statics: {
            result:  (function(){
            	var data = [${opertaions}];
            	
            	if (data.length > 0){
            		return data[0].result || [];
            	} else {
            		return [];
            	}
            })(),
            hasOperation: function(name){
            	var me =  this, i= 0;
            	
            	if (Ext.isString(name)){
            		return Ext.Array.contains(me.result, name);	
            	}
            	if (Ext.isArray(name)){
            		for (; i< name.length; i++){
            			if (Ext.Array.contains(me.result, name[i])){
            				return true;
            			}	
            		}
            	}
            	return false;
            }
        }
    });

</script>
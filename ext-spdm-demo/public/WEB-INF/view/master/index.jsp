
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored ="false" %>
<% request.setAttribute("pageCode", "master"); %>
<!DOCTYPE html>
<html>
    <head>
    	<title>事成主数据管理系统 SPDM</title>
    	
    	<%@ include file="../common/common.jsp" %>
    	
    	<script type="text/javascript">
			Ext.define("SPDM.header", {
        	statics: {
            		data: {username:'${username}', login_date:'${loginDate}'}
        		}
    		});
		</script>
    </head>

	<body>
	</body>

</html>
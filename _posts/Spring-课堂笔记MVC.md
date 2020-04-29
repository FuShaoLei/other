---
title: SpringMVC
top: 0
date: 2020-02-17 13:56:36
tags:
categories: Java
---

> 好文推荐：[Spring MVC【入门】就这一篇！](https://www.jianshu.com/p/91a2d0a1e45a)

# MVC模式
- M：模型层（和数据库相关）
- V：视图层（和界面相关）
- C：控制器

# 简单的demo程序

`web.xml`的配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://xmlns.jcp.org/xml/ns/javaee"
	xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
	id="WebApp_ID" version="3.1">
	<display-name>springmvcdemo1</display-name>
	<welcome-file-list>
		<welcome-file>index.jsp</welcome-file>
	</welcome-file-list>
	<!-- 配置上下文参数 -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>
			classpath*:/applicationContext.xml
		</param-value>
	</context-param>
	<!-- 监听器，监听加载 -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>

	<servlet>
		<servlet-name>springmvc</servlet-name>
		<!-- DispatcherServlet 前端控制器 -->
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<!-- 初始化参数 -->
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>/WEB-INF/spring-mvc.xml</param-value>
		</init-param>
		<!-- 加载顺序为1 -->
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>springmvc</servlet-name>
		<!-- 拦截所有请求 -->
		<url-pattern>/</url-pattern>
	</servlet-mapping>
</web-app>
```

`spring-mvc.xml`的配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- 关于web的配置 -->
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/mvc 
	http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd 
	http://www.springframework.org/schema/beans 
	http://www.springframework.org/schema/beans/spring-beans-4.0.xsd 
	http://www.springframework.org/schema/context 
	http://www.springframework.org/schema/context/spring-context-4.0.xsd">
	<!-- 自动扫描且只扫描@Controller，只扫描Controller注解 -->
	<context:component-scan
		base-package="com.example">
		<context:include-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
	</context:component-scan>
	<!-- 基于注解驱动的SpringMVC -->
	<!-- mvc:annotation-driven enable-matrix-variables="true" / -->
	<!-- 定义JSP文件的位置 -->
	<bean
		class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/" />
		<property name="suffix" value=".jsp" />
	</bean>
</beans>

```

`applicationContext.xml`的配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--除了web以外的配置-->
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:jdbc="http://www.springframework.org/schema/jdbc" xmlns:jee="http://www.springframework.org/schema/jee"
	xmlns:tx="http://www.springframework.org/schema/tx" xmlns:task="http://www.springframework.org/schema/task"
	xmlns:p="http://www.springframework.org/schema/p"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
		http://www.springframework.org/schema/jdbc http://www.springframework.org/schema/jdbc/spring-jdbc-4.0.xsd
		http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-4.0.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
		http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task-4.0.xsd">
	<description>Spring公共配置 </description>

	<!-- 配置Spring上下文的注解 -->
	<context:annotation-config />
	<!-- 使用annotation 自动注册bean, 并保证@Required、@Autowired的属性被注入 -->
	<context:component-scan base-package="com.example">
	<!-- 不扫描Controller注解，即：除了Controller以外的注解都扫描 -->
		<context:exclude-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
	</context:component-scan>
	
</beans>
```

新建两个简单的jsp界面
```jsp
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<a href="hello">Hello World</a>
</body>
</html>
```
```jsp
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
 Hello
</body>
</html>
```

然后新建一个`Controller`类
```java
package com.example;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class mvcController {
	
	//用于映射URL
	@RequestMapping("/hello")
	public String sayHello() {
		System.out.println("Hello World");
		return "hi";
	}
}

```
以上，但点击`index.jsp`中的hello world的时候，便会跳转到`hi.jsp`页面

 --- 

 ## 程序的搭建过程
 1. 创建web工程，导入jar
 2. 配置文件，web.xml  spring-mvc.xml  applicationContext.xml
 3. 编写JSP也米娜和Controller（@Controller @RequestMapping @PathVariable @RequestParam）


# 注解总结
名称 | 功能
--- | ---
`@Controller` | 表明为控制器
`@RequestMapping` | 1.用于映射URL<br>（`@RequestMapping("/cake")`）<br>2.使用method方式来限制请求的类型<br>（`@RequestMapping(value= "/cake",method=RequestMethod.GET)`）
`@PathVariable` | 可获取到路径中的变量

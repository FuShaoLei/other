---
title: 课堂笔记
top: 0
date: 2020-02-17 13:56:36
tags:
categories: Java
---

# 2020年2月17日第一次课

## IoC和DI的概念

- IoC：控制反转（设计原则）`由容器主动将资源推送到它所管理的组件里，组件要有接受资源的方式`
- DI：依赖注入（IoC的典型实现）<!--more-->

## 3种配置元数据的方法

### 基于Xml的配置

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">
	<!-- id写什么都行 只要保证唯一就行，在Spring容器中用id来调用-->
	<!--  class要写完整路径,Spring运行时通过class这个路径来实例化对象放入Spring容器中 -->
	<bean id="InteCpu" class="com.pc.InteCpu"></bean>
	<bean id="Computer" class="com.pc.Computer">
	<!-- name要写Computer中的类名名称 -->
	<!-- ref依赖注入，ref里写id -->
	<property name="cpu" ref="InteCpu"></property>
	</bean>
</beans>
```
然后引用：
```java
package com.pc;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
	public static void main(String[] args) {
		//接口
		ApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
		Computer pc=(Computer)ctx.getBean("Computer");//从Spring容器内调用id为Computer的类（？不知是否改用这个词）
		pc.play();//运行
	}
}
```

### 基于注解的配置

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">
	<!-- 用注解的方式 -->
	<context:annotation-config/>
	<!-- 说明包在哪，然后就会帮你扫描com.pc下所有的类
	当扫描到@Component的时候，则会帮你把这个"组件"实例化出来放入
	Spring容器中（自动分配的id首字母是小写的），当扫描到@Resource的时候，说明要依赖注入，Spring会自动帮你引入依赖-->
	<context:component-scan base-package="com.pc">
	</context:component-scan>
</beans>
```
比如：
```java
package com.pc;
import javax.annotation.Resource;
import org.springframework.stereotype.Component;
/**
 * 配置元数据第二种方法：基于注解的配置
 */
@Component("Computer")
public class Computer {
	//加入这个标签，说明
	@Resource
	private Cpu cpu;

	public void setCpu(Cpu cpu) {
		this.cpu = cpu;
	}
	public void play() {
		this.cpu.run();
		System.out.println("computer is playing by annotation");
	}
}
```
引用的方法和`基于Xml的配置`的差不多

### 基于Java的配置

此方法没有xml文件，纯java引用
```java
package com.pc;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ClassPathXmlApplicationContext;

@Configuration
@ComponentScan("com.pc")
public class Test {
	public static void main(String[] args) {
		//接口
		ApplicationContext ctx=new AnnotationConfigApplicationContext(Test.class);
		Computer pc=(Computer)ctx.getBean("Computer");
		pc.play();
	}
}
```

需要添加注解，此方法可以理解为另一种形式的`基于注解的配置`

> 当扫描到@Component的时候，则会帮你把这个"组件"实例化出来放入
Spring容器中（自动分配的id首字母是小写的），当扫描到@Resource的时候，说明要依赖注入，Spring会自动帮你引入依赖

# 2020年2月18日第二次课
> 讲那么快  👴😭了

## BeanFactory
负责对`Bean`对象的实例化，装配和生命周期的管理
### 与`ApplicationContext`的联系与区别

#### 联系

`ApplicationContext`是`BeanFactory`的一个子接口
#### 区别
- `BeanFactory`提供了配置框架和基本功能，`ApplicationContext`是它的一个完整的超集
- `BeanFactory`直到`getBean()`方法调用时才被创建（慢载入`Bean`）
- `ApplicationContext`启动后载入所有的单列`Bean`

## Bean的实例化

### 通过构造方法
`id`保证唯一性，`class`里填完整路径
```xml
<bean id="InteCpu" class="com.pc.InteCpu"></bean>
```
### 使用静态工厂方法
在类中写静态方法，用静态方法来返回某一个类的对象,`factory-method`里写静态方法的名称
```xml
<bean id="Computer" class="com.pc.Computer" factory-method="createInstance"></bean>
```
### 使用实例工厂方法

这时则没有`class`属性，`factory-bean`来指定所要的`bean`名称,用`factory-method`来指定要用的方法
```xml
<bean id="Thinkpad" class="com.pc.Thinkpad"></bean>
<bean id="Computer" factory-bean="Thinkpad" factory-method="createComputer"></bean>
```
## Bean的依赖注入

### 方式

#### 1.构造器注入
- 注入值：`<constructor-arg value="xxx"></constructor-arg>`
- 注入方法：`<constructor-arg ref="xxx"></constructor-arg>`
> 还可以加入type index name这些属性

#### 2.`Setter`方法注入

自动调用`set`方法来进行注入
- 注入值：`<property name="xxx" value="xxx"></property>`
- 注入方法：`<property name="xxx" ref="xxx"></property>`

##### 基本Bean注入
- 注入List/Array
```xml
<property name=“xxx”>
<list>
<ref bean=“aa”/>
<ref bean=“bb” />
<value>aaa</value>
<value>bbb</value>
</list>
</property>
```
- 注入Set
```xml
<property name=“xxx”>
<set>
<value>java</value>
<value>c</value>
<value>java</value>
</set>
</property>
```
- 注入Map
```xml
<property name=“xxx”>
<map>
<entry key="a" value-ref="aa" />
<entry key="b" value-ref="bb" />
</map>
</property>
```
- 注入Properties
```xml
<property name=“xxx”>
<props>
<prop key="a">aaa</prop>
<prop key="b">bbb</prop>
</props>
</property>
```

> 🥤 Bean是一个由Spring IoC容器进行实例化、装配和管理的对象，
Beans以及他们之间的依赖关系是通过容器使用配置元数据反应出来的

# 2020年2月20日第三次课

## SpringEL表达式
> 听了老师讲还是不太明白，毕竟基础不大好，推荐一篇文章：[springEL表达式详解及应用](https://blog.csdn.net/u011305680/article/details/80271423)

# 2020年2月24日第四次课
> AOP 面向切面编程
## 代理模式
### 静态代理
在不改变原有的基础上去增加功能

## 通知类型
- 前置通知
- 后置通知
- 异常通知
- 环绕通知：包围一个连接点的通知，（暂时不是很理解。。。）
### xml配置如下
```xml
<bean id="UserServiceImpl" class="com.user.UserServiceImpl"></bean>
<bean id="Md5Advice" class="com.advice.Md5Advice"></bean>
<!-- 此工厂类会帮助实现代理对象 -->
<bean id="UserProxy"
	class="org.springframework.aop.framework.ProxyFactoryBean">
	<!-- 指定接口 -->
    <property name="proxyInterfaces" value="com.user.UserService"></property>
	<!-- 指定要植入的通知 -->
	<property name="interceptorNames">
		<list>
			<value>Md5Advice</value>
		</list>
	</property>
	<!-- 指定目标对象 -->
	<property name="target" ref="UserServiceImpl"></property>
	<!-- 通知通过接口植入给目标对象 -->
</bean>
```
> 意思是只目标对象可用这个特殊的通知，简单来理解就是现在`UserServiceImpl`可以用`Md5Advice`类了，它是通过接口`com.user.UserService`赋予给`UserServiceImpl`的

# 2020年2月25日第五次课
> 主要补充了aop的其他两种方法，简单记住就行
## 基于注解的配置
`java`文件如下
```java
//待补充
```
`xml`文件特殊如下
```xml
<aop:config>
	<aop:aspect id="MyAspect" ref="MyAdvice" order="2">
		<aop:before method="before" pointcut="execution(* com.user.*.*(..))" />
		<aop:after-returning method="afterReturning" pointcut="execution(* com.user.*.*(..))" returning="result"/>
		<aop:around method="around" pointcut="execution(* com.user.*.*(..))" />
		<!--aop:after-throwing method="throwExMethod" pointcut="execution(* service.*.*(..))" throwing="ex"/-->
		<aop:after method="after" pointcut="execution(* com.user.*.*(..))" />
	</aop:aspect>
</aop:config>
```
> 列入第一个`<aop/>`标签：pointcut指向的是切点，植入的通知是`before`(`method="before"`)，植入的类型是前置通知,以此类推即可

# 2020年3月2日第六次课
> SpringMVC
`@Controller`表明是一个控制器


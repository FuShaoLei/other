---
title: Hibernate | 课堂学习笔记
thumbnail: https://cn.bing.com/th?id=OHR.CloudsPelmo_ZH-CN3713829654_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
top: 0
date: 2020-02-19 20:18:42
tags:
categories:
---
# Hibernate链接MySQL8.0.11遇到的一些问题

`hibernate.cfg.xml`文件要改成如下

<!--more-->

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD 3.0//EN" "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
	<session-factory>
		<!--数据库名称：hibernate_first -->
		<property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
		<property name="hibernate.connection.url">jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC</property>
		<property name="hibernate.connection.username">root</property>
		<property name="hibernate.connection.password">18389621811</property>
		<!-- 设置方言 -->
		<property name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>
		<property name="hibernate.show_sql">true</property>
		<property name="hibernate.format_sql">true</property>

		<mapping resource="com/hibernate/entity/Customer.hbm.xml" />
	</session-factory>
</hibernate-configuration>
```
# 2020年2月21日第三次课(单实体映射)
## 创建Hibernate项目的步骤
### 1.编写Hibernate配置文件
👇`hibernate.cfg.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD 3.0//EN" "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
	<session-factory>
		<!--数据库名称：hibernate_first -->
		<property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
		<property name="hibernate.connection.url">jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC</property>
		<property name="hibernate.connection.username">root</property>
		<property name="hibernate.connection.password">18389621811</property>
		<!-- 设置方言 -->
		<property name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>
		<property name="hibernate.show_sql">true</property>
		<property name="hibernate.format_sql">true</property>
		<mapping resource="com/hibernate/entity/House.hbm.xml" />
	</session-factory>
</hibernate-configuration>
```
### 2.创建java持久化类
在`com.hibernate.entity`里创建
```java
package com.hibernate.entity;

public class House {
	private Integer houseId;//房屋ID
	private String address;//房屋地址
	private String type;//如：三室两厅、两室两厅等
	private float area;//房屋面积
	private int rental;//租金	
	public Integer getHouseId() {
		return houseId;
	}
	public void setHouseId(Integer houseId) {
		this.houseId = houseId;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public float getArea() {
		return area;
	}
	public void setArea(float area) {
		this.area = area;
	}
	public int getRental() {
		return rental;
	}
	public void setRental(int rental) {
		this.rental = rental;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}

```
### 3.编写持久化类的映射配置文件`House.hbm.xml`
在`com.hibernate.entity`中
```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">
<hibernate-mapping package="com.hibernate.entity">
	<class name="House" table="house">
		<id name="houseId">
			<generator class="increment"></generator>
		</id>
		<property name="address"></property>
		<property name="type"></property>
		<property name="area"></property>
		<property name="rental"></property>
	</class>
</hibernate-mapping>

```
### 4.创建Hibernate工具类
```java
package com.hibernate.util;

import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

public class HibernateUtil {
	private static SessionFactory sessionFactory;
	static {
		final StandardServiceRegistry registry
		=new StandardServiceRegistryBuilder()
		.configure()
		.build();
		try {
			sessionFactory=new MetadataSources(registry)
					.buildMetadata()
					.buildSessionFactory();
		} catch (Exception e) {
			// TODO: handle exception
			sessionFactory=null;
			StandardServiceRegistryBuilder.destroy(registry);
		}
	}
	public static SessionFactory getSessionFactory() {
		return sessionFactory;
	}
	
	public static void closeSessionFactory() {
		sessionFactory.close();
	}
}

```
### 5.使用！
```java
package com.hibernate.ui;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.hibernate.entity.House;
import com.hibernate.util.HibernateUtil;

public class Test {
	private static Session session=HibernateUtil.getSessionFactory().openSession();
	private static Transaction tx=session.beginTransaction();
	//1.添加
	public static void addHouse(Integer id,String address,String type,float area,int rental) {
		House h=new House();
		h.setHouseId(id);
		h.setAddress(address);
		h.setType(type);
		h.setArea(area);
		h.setRental(rental);
		session.save(h);
	}
	//根据id查询房屋信息
	public static House searchHouse(Integer id) {
		House resultHouse=session.get(House.class, new Integer(id));
		return resultHouse;
	}
	//3.删除
	public static void deleteHouse(Integer id) {
		House h2=session.get(House.class, new Integer(id));
		session.delete(h2);
	}
	//4.根据id修改租金
	public static void modifyHouseRental(Integer id,int rental) {
		House h4=session.get(House.class, new Integer(id));
		h4.setRental(rental);
		session.save(h4);
		
	}
	public static void main(String[] args) {

		//测试
		addHouse(1, "海南","三室两厅" , 100, 200);
		deleteHouse(1);
		modifyHouseRental(2, 233);
		House result=searchHouse(2);
		System.out.println("==============搜索结果是==========");
		System.out.println("houseId="+result.getHouseId());
		System.out.println("address="+result.getAddress());
		System.out.println("type="+result.getType());
		System.out.println("area="+result.getArea());
		System.out.println("rental="+result.getRental());
		
		tx.commit();
		session.close();
		HibernateUtil.closeSessionFactory();
	}
}

```

## 单实体的属性映射
### 访问持久化类
> 在实体关系配置时，加入dynamic-insert / dynamic-update 会在执行插入或更新时动态判断字段是否为null（或是否有更新），如果为null（或没有更新）则不更新这类字段，也就不会产生异常。它的原理是在实体被加载到session中时会保存一份快照，如果在后续的更新操作检测到有更新，则动态生成更新部分涉及到的字段的sql。

# 2020年2月25日第四次课
> 继承关系映射

# 2020年2月26日第五次课
> [hibernate(五) hibernate一对一关系映射详解](https://www.cnblogs.com/whgk/p/6128395.html)
## 一对一关联映射
### 主键关联映射
👉主键表设置

```xml
<one-to-one name="person" class="Person"
cascade="all"/>
```
👉外键表设置
```xml
<id name="id" >
<!--直接在这里申明该主键就是外键，并且指向了user这个类-->
    <generator class="foreign" >
        <param name="property" >user</param> 
    </generator>
</id>
<!--constrained 属性为 true，表明此表 ID 为
外键，参照主表（user） -->
<one-to-one name="user" constrained="true" />
```
### 唯一外键关联映射
👉主键表设置

```xml
<!--只是增加了一个unique属性。这样就指定了这端唯一了-->
<many-to-one name="person" column="PERSONID"
cascade="all" unique="true"/>
```
👉外键表设置
```xml
<one-to-one name="user" property-ref="person"/>
```

inverse="true"是被控方。为false时为主控方
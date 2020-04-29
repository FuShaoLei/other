---
title: MyBatis入门
date: 2020-03-16 20:18:42
tags:
categories: Java
---
# 2020年3月17日
与hibernate的区别
- mybatis创建的是实体和sql语句之间建立映射
- 而hibernate创建的是实体和数据库之间的映射

## 第一个MyBatischengx

1. 创建javachengx
2. 引入Mybatis包和连接数据库的包
3. 编写主配置文件`mybatis.xml`
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!-- 将sql语句打印到控制台 -->
	<settings>
		<setting name="logImpl" value="STDOUT_LOGGING" />
	</settings>
	<environments default="dev">
		<environment id="dev">
			<transactionManager type="JDBC" />
			<dataSource type="POOLED">
				<property name="driver" value="com.mysql.cj.jdbc.Driver" />
				<property name="url"
					value="jdbc:mysql://localhost:3306/test?serverTimezone=UTC" />
				<property name="username" value="root" />
				<property name="password" value="18389621811" />
			</dataSource>
		</environment>
	</environments>
	<mappers>
		<mapper resource="com/mapper/UserMapper.xml" />
	</mappers>
</configuration>
```
4. 创建映射文件`Mapper`,像下边这样
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mapper.UserMapper">
  <select id="selectAll" resultType="com.entity.User">
    select * from user 
  </select>
  <insert id="insertUser" parameterType="com.entity.User">
		insert into user (username,password) values (#{userName},#{password})
  </insert>
</mapper>
```
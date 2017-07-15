var path=require('path');
var assert=require('assert');
var request=require('supertest');
var app=require('../index');
var User=require('../lib/mongo').User;

var testName1='testName1';
var testName2='nswbmw';

describe('signup',function(){
	describe('POST/signup',function(){
		var agent=request.agent(app); //persist coookie when redirect
		beforeEach(function(done){
			// 创建一个用户
			User.create({
				name:testName1,
				password:'123456',
				avatar:'',
				gender:'x',
				bio:''
			})
			.exec()
			.then(function(){
				done();
			})
			.catch(done);
		});

		afterEach(function(done){
			// 删除测试用户
			User.remove({name:{$in:[testName1,testName2]}})
				.exec()
				.then(function(){
					done();
				})
				.catch(done);
		});

		// 名称名错误的情况
		it('wrong name',function(done){
			agent
				.post('/signup')
				.type('form')
				.attach('avatar',path.join(__dirname,'4.jpg'))
				.field({name:''})
				.redirects()
				.end(function(err,res){
					if(err)return done(err);
					assert(res.text.match(/名字限制在1-10个字符/));
					done();
				});
		});

		// 性别错误的情况
		it('wrong gender',function(){
			agent
				.post('/signup')
				.type('form')
				.attach('avatar',path.join(__dirname,'4.jpg'))
				.field({name:testName2,gender:'a'})
				.redirects()
				.end(function(err,res){
					if(err)return done(err);
					assert(res.text.match(/性别只能是m、f或x/));
					done();
				});
		});

		// 用户名被占用的情况
		if('duplicate name',function(done){
			agent
				.post('/signup')
				.type('form')
				.attach('avatar',path.join(__dirname,'4.jpg'))
				.field({name:testName1,gender:'m',bio:'noder',password:'123456',repassword:'123456'})
				.redirects()
				.end(function(err,res){
					if(err) return done(err);
					assert(res,text.match(/用户名已经被占用/));
					done();
				});
		});

		// 注册成功的情况
		if('success',function(done){
			agent
				.post('/signup')
				.type('form')
				.attach('avatar',path.join(__dirname,'4.jpg'))
				.field({name:testName2,gender:'m',bio:'noder',password:'123456',repassword:'123456'})
				.redirects()
				.end(function(err,res){
					if(err) return done(err);
					assert(res,text.match(/注册成功/));
					done();
				});
		});

	});
});
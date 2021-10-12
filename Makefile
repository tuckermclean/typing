all: run

run:
	docker run -p 80:80 -v `pwd`:/usr/share/nginx/html -it nginx

upload:
	scp * noumenon@aztlan.dcxxiv.com:/var/www/html/typing/

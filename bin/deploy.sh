#!/bin/bash

host=""
port=22
echo "请选择想要部署的环境:"
select env in "Local" "Staging"
do
  case ${env} in
    Local)
    host=zcw@192.168.0.200
    break;;
    Staging)
    host=zcw@47.101.29.93
    port=1022
    break;;
    *)
    echo "输入错误，请重新选择。"
    ;;
   esac
done

echo -e "\033[34m>>>    正在打包....\033[0m"
rm -rf dist/ && npm run build

echo -e "\033[34m>>>    开始项目部署....\033[0m"
scp -P ${port} -Crq dist/* ${host}:/var/www/html/vendor/

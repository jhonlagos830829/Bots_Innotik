git pull git@github.com:jhonlagos830829/Bots_Innotik.git main
pm2 stop BOT_CASALINS
pm2 delete BOT_CASALINS
pm2 --name BOT_CASALINS start "npm start" --cron-restart="0 1,8,16 * * *"
pm2 save
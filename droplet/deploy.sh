ssh root@64.227.96.26 "rm -rf /root/eriknet/*" && rsync -avr . root@64.227.96.26:/root/eriknet/
#ssh root@64.227.96.26 "sed -i 's/ENV=DEV/ENV=PROD/g' /root/eriknet/.env"
ssh root@64.227.96.26 "cd /root/eriknet/ && go build main.go"

# Create a new systemd service unit file or overwrite the existing one
ssh root@64.227.96.26 "cat <<EOF > /etc/systemd/system/eriknet.service
[Unit]
Description=Erik Net Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/eriknet
ExecStart=/root/eriknet/main
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF"

# Reload systemd to read the new service file, enable, stop, and start the service
ssh root@64.227.96.26 "systemctl daemon-reload && systemctl enable athena.service && systemctl restart athena.service"

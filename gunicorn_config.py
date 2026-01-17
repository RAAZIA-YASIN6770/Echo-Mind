import multiprocessing
import os

bind = "0.0.0.0:8080"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 4
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
keepalive = 5

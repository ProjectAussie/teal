FROM conda/miniconda3

RUN conda update --all -y
RUN conda install -y -c bioconda tracy
RUN conda install -y flask flask-cors

CMD ["python", "server/server.py"]

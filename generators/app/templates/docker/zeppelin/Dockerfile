# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# ORIGINAL MANTAINER: Apache Software Foundation <dev@zeppelin.apache.org>

FROM ubuntu:16.04
LABEL authors="Federico Cocco <federicocdev@gmail.com>, Apache Software Foundation <dev@zeppelin.apache.org>"

# `Z_VERSION` will be updated by `dev/change_zeppelin_version.sh`
ENV Z_VERSION="0.8.1"
ENV LOG_TAG="[ZEPPELIN_${Z_VERSION}]:" \
    Z_HOME="/zeppelin" \
    LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8

RUN echo "$LOG_TAG update and install basic packages" && \
    apt-get -y update && \
    apt-get install -y locales && \
    locale-gen $LANG && \
    apt-get install -y software-properties-common && \
    apt -y autoclean && \
    apt -y dist-upgrade && \
    apt-get install -y build-essential

RUN echo "$LOG_TAG install tini related packages" && \
    apt-get install -y wget curl grep sed dpkg && \
    TINI_VERSION=`curl https://github.com/krallin/tini/releases/latest | grep -o "/v.*\"" | sed 's:^..\(.*\).$:\1:'` && \
    curl -L "https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini_${TINI_VERSION}.deb" > tini.deb && \
    dpkg -i tini.deb && \
    rm tini.deb

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
RUN echo "$LOG_TAG Install java8" && \
    apt-get -y update && \
    apt-get install -y openjdk-8-jdk && \
    rm -rf /var/lib/apt/lists/*

# should install conda first before numpy, matploylib since pip and python will be installed by conda
RUN echo "$LOG_TAG Install miniconda2 related packages" && \
    apt-get -y update && \
    apt-get install -y bzip2 ca-certificates \
    libglib2.0-0 libxext6 libsm6 libxrender1 \
    git mercurial subversion && \
    echo 'export PATH=/opt/conda/bin:$PATH' > /etc/profile.d/conda.sh && \
    wget --quiet https://repo.continuum.io/miniconda/Miniconda2-4.2.12-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh
ENV PATH /opt/conda/bin:$PATH

RUN echo "$LOG_TAG Install python related packages" && \
    apt-get -y update && \
    apt-get install -y python3-dev python3-pip && \
    apt-get install -y gfortran && \
    echo "$LOG_TAG Install numerical/algebra packages" && \
    apt-get install -y libblas-dev libatlas-dev liblapack-dev && \
    echo "$LOG_TAG Install font, image for matplotlib" && \
    apt-get install -y libpng-dev libfreetype6-dev libxft-dev && \
    echo "$LOG_TAG For tkinter" && \
    apt-get install -y python3-tk libxml2-dev libxslt-dev zlib1g-dev && \
    conda config --set always_yes yes --set changeps1 no && \
    echo "$LOG_TAG Upgrade conda and pip" && \
    conda update -q conda && \
    conda info -a && \
    conda config --add channels conda-forge && \
    conda update setuptools && \
    pip install --upgrade setuptools --user python && \
    pip install --upgrade --force-reinstall pip==9.0.3 && \
    python -V && \
    echo "$LOG_TAG Install additional pip packages" && \
    pip install -q numpy==1.14.5 pandas==0.21.1 matplotlib==2.1.1 pandasql==0.7.3 ipython==5.4.1 jupyter_client==5.1.0 ipykernel==4.7.0 bokeh==0.12.10 ggplot==0.11.5 grpcio==1.8.6 bkzep==0.4.0 keras==2.2.4 nltk==3.4.4 tensorflow==1.14.0 gensim==3.8.0 regex==2019.06.08 && \
    pip install --upgrade pip

RUN echo "$LOG_TAG Install R related packages" && \
    echo "deb http://cran.rstudio.com/bin/linux/ubuntu xenial/" | tee -a /etc/apt/sources.list && \
    gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9 && \
    gpg -a --export E084DAB9 | apt-key add - && \
    apt-get -y update && \
    apt-get -y install r-base r-base-dev && \
    R -e "install.packages('knitr', repos='http://cran.us.r-project.org')" && \
    R -e "install.packages('ggplot2', repos='http://cran.us.r-project.org')" && \
    R -e "install.packages('googleVis', repos='http://cran.us.r-project.org')" && \
    R -e "install.packages('data.table', repos='http://cran.us.r-project.org')" && \
    echo "$LOG_TAG for devtools, Rcpp" && \
    apt-get -y install libcurl4-gnutls-dev libssl-dev && \
    R -e "install.packages('devtools', repos='http://cran.us.r-project.org')" && \
    R -e "install.packages('Rcpp', repos='http://cran.us.r-project.org')" && \
    Rscript -e "library('devtools'); library('Rcpp'); install_github('ramnathv/rCharts')"

RUN echo "$LOG_TAG Download Zeppelin binary" && \
    wget -O /tmp/zeppelin-${Z_VERSION}-bin-all.tgz http://archive.apache.org/dist/zeppelin/zeppelin-${Z_VERSION}/zeppelin-${Z_VERSION}-bin-all.tgz && \
    tar -zxvf /tmp/zeppelin-${Z_VERSION}-bin-all.tgz && \
    rm -rf /tmp/zeppelin-${Z_VERSION}-bin-all.tgz && \
    mv /zeppelin-${Z_VERSION}-bin-all ${Z_HOME}

RUN echo "$LOG_TAG Cleanup" && \
    apt-get autoclean && \
    apt-get clean

EXPOSE 8100

ENTRYPOINT [ "/usr/bin/tini", "--" ]
WORKDIR ${Z_HOME}
CMD ["bin/zeppelin.sh"]
FROM oven/bun:1.0.30 AS build
COPY --from=node:20.11.1 /usr/local/bin/node /usr/local/bin/node

RUN apt update && apt install -y vim sudo curl make
RUN apt-get -y autoremove \
  && apt-get -y clean \
  && rm -rf /var/lib/apt/lists/*

RUN echo 'bun ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
WORKDIR /home/bun/.zsh

RUN curl -o git-prompt.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh
RUN curl -o git-completion.bash https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN curl -o _git https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.zsh
RUN chmod a+x git*.*

RUN ls -l $PWD/git*.* | awk '{print "source "$9}' >> /home/bun/.zshrc
RUN echo "source ~/.bash/git-prompt.sh" >> /home/bun/.zshrc
RUN echo "fpath=(~/.bash $fpath)" >> /home/bun/.zshrc
RUN echo "GIT_PS1_SHOWDIRTYSTATE=true" >> /home/bun/.zshrc
RUN echo "GIT_PS1_SHOWUNTRACKEDFILES=true" >> /home/bun/.zshrc
RUN echo "GIT_PS1_SHOWSTASHSTATE=true" >> /home/bun/.zshrc
RUN echo "GIT_PS1_SHOWUPSTREAM=auto" >> /home/bun/.zshrc
RUN echo 'export PS1="\[\033[01;32m\]\u@\h\[\033[01;33m\] \w \[\033[01;31m\]\$(__git_ps1 \"(%s)\") \\n\[\033[01;34m\]\\$ \[\033[00m\]"' >> /home/bun/.zshrc

RUN echo "set encoding=utf-8" > /home/bun/.vimrc

USER bun
WORKDIR /home/bun/app
CMD ["/bin/bash"]

FROM ruby:3.4.6-slim

RUN apt-get update -qq && apt-get install -y \
    build-essential default-libmysqlclient-dev pkg-config git libyaml-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["rails", "exec", "rails", "server"]
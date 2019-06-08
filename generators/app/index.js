'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

function formatAppName(str) {
  const s = str.replace(" ", "_");
  return s.replace(/^([0-9])/, "");
}

function toCamelCase(str) {
  const s = str.replace("_", "");
  return s.replace(/\W+(.)/g, function(match, chr) {
    return chr.toUpperCase();
  });
}

function orgToPath(str) {
  const lwCase = str.toLowerCase();
  return lwCase.replace(".", "/");
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the marvelous ${chalk.red('generator-docker-spark')} generator!`)
    );

    const prompts = [
      {
        type    : 'input',
        name    : 'appName',
        message : 'App Name',
        default : 'Docker Spark'
      },
      {
        type    : 'input',
        name    : 'organization',
        message : 'Enter organization',
        default : 'org.fcocco01'
      }
    ];

    return this.prompt(prompts).then(props => {
      const packageName = formatAppName(props.appName.toLowerCase());
      const nameInCamelCase = toCamelCase(packageName);
      const orgName = props.organization.toLowerCase();

      this.context = {
        name: props.appName,
        packageName: packageName,
        nameInCamelCase: nameInCamelCase,
        org: orgName
      };

      this.props = props;
    });
  }

  writing() {
    this.log('Generating app');

    this.fs.copyTpl(
      this.templatePath("project/build.properties"),
      this.destinationPath("project/build.properties"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("project/plugins.sbt"),
      this.destinationPath("project/plugins.sbt"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("project/sbtdocker/DockerCompose.scala"),
      this.destinationPath("project/sbtdocker/DockerCompose.scala"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-base/Dockerfile'),
      this.destinationPath('docker/spark-base/Dockerfile'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-master/Dockerfile'),
      this.destinationPath('docker/spark-master/Dockerfile'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-worker/Dockerfile'),
      this.destinationPath('docker/spark-worker/Dockerfile'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-submit/Dockerfile'),
      this.destinationPath('docker/spark-submit/Dockerfile'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-master/start-master.sh'),
      this.destinationPath('docker/spark-master/start-master.sh'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-worker/start-worker.sh'),
      this.destinationPath('docker/spark-worker/start-worker.sh'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/spark-submit/spark-submit.sh'),
      this.destinationPath('docker/spark-submit/spark-submit.sh'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('docker/zeppelin/Dockerfile'),
      this.destinationPath('docker/zeppelin/Dockerfile'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath(`src/main/scala/Main.scala`),
      this.destinationPath(`src/main/scala/${orgToPath(this.context.org)}/Main.scala`),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('src/main/java'),
      this.destinationPath('src/main/java'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('src/test/scala'),
      this.destinationPath('src/test/scala'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('src/test/java'),
      this.destinationPath('src/test/java'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('env/spark-worker.sh'),
      this.destinationPath('env/spark-worker.sh'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('mnt/spark-apps'),
      this.destinationPath('mnt/spark-apps'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('mnt/spark-data'),
      this.destinationPath('mnt/spark-data'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath('mnt/zeppelin-data/notebook'),
      this.destinationPath('mnt/zeppelin-data/notebook'),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath(".dockerignore"),
      this.destinationPath(".dockerignore"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("build.sbt"),
      this.destinationPath("build.sbt"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("docker-compose.yml"),
      this.destinationPath("docker-compose.yml"),
      this.context
    );

    this.fs.copyTpl(
      this.templatePath("docker-compose-notebook.override.yml"),
      this.destinationPath("docker-compose-notebook.override.yml"),
      this.context
    );
    this.fs.copyTpl(
      this.templatePath("build-images.sh"),
      this.destinationPath("build-images.sh"),
      this.context
    );
  }

  install() {
    this.installDependencies();
  }
};

import scala.language.postfixOps
import sys.process._

lazy val dockerComposeUp = taskKey[Unit]("Build and bring up docker instances")
lazy val dockerComposeStart = taskKey[Unit]("Restart existing stopped instances")
lazy val dockerComposeStop = taskKey[Unit]("Stop instances")
lazy val dockerComposeDown = taskKey[Unit]("Destroy and remove everything")
lazy val dockerComposeUpZeppelin = taskKey[Unit]("Startup with zeppelin")

lazy val checkOs: Boolean = sys.props("os.name").contains("Windows")
lazy val shell: Seq[String] = if(checkOs) Seq("cmd", "/c") else Seq("bash", "-c")

dockerComposeUp := {
  val s: TaskStreams = streams.value
  s.log.info("building images...")
  val pre: Seq[String] = shell :+ (if(!checkOs) "chmod +x build-images.sh" else "echo y| cacls build-images.sh /g everyone:f")
  val buildImgs: Seq[String] = shell :+ (if(checkOs) "sh build-images.sh" else "./build-images.sh")
  s.log.info("bringing up instances...")
  val dockerComposeUp: Seq[String] = shell :+ "docker-compose up -d"
  if((pre #&& buildImgs #&& dockerComposeUp !) == 0) {
    s.log.success("docker starts successfully!")
  } else {
    throw new IllegalStateException("docker compose failed!")
  }
}

dockerComposeUpZeppelin := {
  val s: TaskStreams = streams.value
  s.log.info("building images...")
  val pre: Seq[String] = shell :+ (if(!checkOs) "chmod +x build-images.sh" else "echo y| cacls build-images.sh /g everyone:f")
  val buildImgs: Seq[String] = shell :+ (if(checkOs) "sh build-images.sh" else "./build-images.sh")
  s.log.info("bringing up instances...")
  val dockerComposeUp: Seq[String] = shell :+ "docker-compose -f docker-compose.yml -f docker-compose-notebook.override.yml up -d"
  if((pre #&& buildImgs #&& dockerComposeUp !) == 0) {
    s.log.success("docker starts successfully!")
  } else {
    throw new IllegalStateException("docker compose failed!")
  }
}

dockerComposeStart := {
  val s: TaskStreams = streams.value
  s.log.info("docker compose starting...")
  val x: Seq[String] = shell :+ "docker-compose start"
  if((x !) == 0) {
    s.log.success("starting successful!")
  } else {
    throw new IllegalStateException("starting failed!")
  }
}

dockerComposeStop := {
  val s: TaskStreams = streams.value
  s.log.info("docker compose stopping instances...")
  val x: Seq[String] = shell :+ "docker-compose stop"
  if((x !) == 0) {
    s.log.success("stopping successful!")
  } else {
    throw new IllegalStateException("stopping failed!")
  }
}

dockerComposeDown := {
  val s: TaskStreams = streams.value
  s.log.info("docker compose bringing down instances...")
  val x: Seq[String] = shell :+ "docker-compose down"
  if((x !) == 0) {
    s.log.success("successful!")
  } else {
    throw new IllegalStateException("failed!")
  }
}

addCommandAlias("dup", ";dockerComposeDown;dockerComposeUp")
addCommandAlias("dstart", ";dockerComposeStart")
addCommandAlias("dstop", ";dockerComposeStop")
addCommandAlias("ddown", ";dockerComposeDown")
addCommandAlias("zepup", ";dockerComposeDown;dockerComposeUpZeppelin")

val dependencies = {
  val slf4sVersion = "1.7.12"

  Seq(
    "org.slf4s"              %% "slf4s-api"         % slf4sVersion
  )
}

lazy val <%= nameInCamelCase %> = (project in file("."))
  .settings(
    name := `<%= name %>`,
    version := "0.1",
    scalaVersion := "2.12.8",
    organization := `<%= org %>`,
    libraryDependencies ++= dependencies
  )


fork := true
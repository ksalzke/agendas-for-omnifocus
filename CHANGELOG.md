## [1.9.2](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.9.1...v1.9.2) (2023-03-31)


### Bug Fixes

* :bug: allow 'manage agenda items' to be run on events that are projects ([b73e306](https://github.com/ksalzke/agendas-for-omnifocus/commit/b73e3063f5e8d8a61d180c90db15106576424a05))



## [1.9.1](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.9.0...v1.9.1) (2023-02-13)


### Bug Fixes

* :bug: fix bug where agenda items could not be re-linked from dialogue ([74ce79e](https://github.com/ksalzke/agendas-for-omnifocus/commit/74ce79e93406f661633b6348d603d52fc0dd4562))



# [1.9.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.8.0...v1.9.0) (2022-06-25)


### Bug Fixes

* :bug: fix 'show agenda item' processing dialogue bug ([e32316a](https://github.com/ksalzke/agendas-for-omnifocus/commit/e32316a2e9c604a2a02e2fc85b8cf1c8ea12eeba))
* :bug: open inbox when 'goTo' task is in the inbox instead of silently failing ([6f2f6b9](https://github.com/ksalzke/agendas-for-omnifocus/commit/6f2f6b9e6c3bdfda9e8d909db8e42a8045e3e35f))


### Features

* :lipstick: add option to show certain tags in processing dialogue ([85ec2e4](https://github.com/ksalzke/agendas-for-omnifocus/commit/85ec2e4d7b43b51ba81d323ba127a705f33b63a5))
* :lipstick: label inactive agenda items as [INACTIVE] and move to bottom of list ([9d3b238](https://github.com/ksalzke/agendas-for-omnifocus/commit/9d3b23891d12823347dc85e3da804634daebf379))
* :lipstick: show event tags if more than one set in preferences ([25db5b7](https://github.com/ksalzke/agendas-for-omnifocus/commit/25db5b7fcc591ec75bb5c46af8c687096fde5813))
* :sparkles: add 'Add To Agenda Via Project' action ([97a8f06](https://github.com/ksalzke/agendas-for-omnifocus/commit/97a8f068fd84e4589e3f475e5f764f216e2f018e))



# [1.8.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.7.0...v1.8.0) (2022-06-13)


### Bug Fixes

* :bug: remove async from 'reset processing dialogue' action ([a58080a](https://github.com/ksalzke/agendas-for-omnifocus/commit/a58080a9a07aa8d98266eb031ac2530a63dee34f))


### Features

* :sparkles: add 'edit note' processing option ([b26c2df](https://github.com/ksalzke/agendas-for-omnifocus/commit/b26c2df4d00b04508b65852ba0a2f004b784eadf))
* :sparkles: add 'Set Last Updated' action ([e13ccde](https://github.com/ksalzke/agendas-for-omnifocus/commit/e13ccdef6a93db1f973583cf27b31bd0685d2f4d))
* :sparkles: add KM macro to run 'resetProcessingDialogue' action ([c0d68a8](https://github.com/ksalzke/agendas-for-omnifocus/commit/c0d68a8113c1c40fc0fdc6be357b0f401a3544e6))



# [1.7.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.6.0...v1.7.0) (2022-02-19)


### Features

* :lipstick: rename 'Preferences' to 'Preferences: Agendas' ([6acd63a](https://github.com/ksalzke/agendas-for-omnifocus/commit/6acd63a2153a1d5139c03ccb392d4be071d4205a))



# [1.6.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.5.0...v1.6.0) (2022-02-16)


### Bug Fixes

* :bug: allow 'remove from agenda' to be invoked on agenda items that are projects ([c6bf404](https://github.com/ksalzke/agendas-for-omnifocus/commit/c6bf404b1f1301a8568f00e5008f94b5d184ee6c))


### Features

* :sparkles: add supplementary action to reset 'processEventRunning' preference if needed ([4dd02f4](https://github.com/ksalzke/agendas-for-omnifocus/commit/4dd02f4f8edd1fe6cf28b7bcd218796e31d63361))



# [1.5.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.4.0...v1.5.0) (2022-02-15)


### Features

* :lipstick: show [LINKED] for already-linked events, rather than removing from the list completely ([91ba5ba](https://github.com/ksalzke/agendas-for-omnifocus/commit/91ba5badacbeecf66db00f3165e550c932bc12c9))



# [1.4.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.3.1...v1.4.0) (2022-02-13)


### Bug Fixes

* :bug: add in missing 'await's ([c3264fe](https://github.com/ksalzke/agendas-for-omnifocus/commit/c3264fe605c40178cde8355a13a66b1cf0f211a5))
* :bug: fix bug re earlier async change ([e4391f1](https://github.com/ksalzke/agendas-for-omnifocus/commit/e4391f156b59c7801d2628063b36f3497ff333cc))
* :bug: update checks of remaining events to use for ... of instead of forEach ([52a9672](https://github.com/ksalzke/agendas-for-omnifocus/commit/52a9672093364bde5c4b88857d69206e77e0434f))


### Features

* :lipstick: change SF symbols to be more relevant ([e02d6d6](https://github.com/ksalzke/agendas-for-omnifocus/commit/e02d6d69107710d7d5a9b09a4f24dfc13c3dc2b0))


### Reverts

* Revert "refactor: :recycle: convert getAllEvents to a synchronous function" ([9c53e71](https://github.com/ksalzke/agendas-for-omnifocus/commit/9c53e71e4b7c9af9e1548076627bb57e13006f5d))



## [1.3.1](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.3.0...v1.3.1) (2022-02-09)


### Bug Fixes

* :bug: fix issue with being unable to add multiple agenda items simultaneously ([efd7266](https://github.com/ksalzke/agendas-for-omnifocus/commit/efd726677659987955ef092e06e0b1b8e518aa6f))



# [1.3.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.2.1...v1.3.0) (2022-02-09)


### Bug Fixes

* :bug: improve handling of repeating events ([508a38c](https://github.com/ksalzke/agendas-for-omnifocus/commit/508a38c0e371d76081784b59790458e6a5d1cf49))
* :bug: replace Keyboard Maestro macro with functional solution ([e0b7e04](https://github.com/ksalzke/agendas-for-omnifocus/commit/e0b7e0406d3b07bc4c173decbac571e08e8fa97a))
* :lipstick: only show 'process event' form if one is not already shown ([c61a592](https://github.com/ksalzke/agendas-for-omnifocus/commit/c61a59284e6125a72223c6c78eb491d13ff016c0))
* :lipstick: only show processing form once if event is linked to multiple agenda items and form is cancelled ([dd0d3c9](https://github.com/ksalzke/agendas-for-omnifocus/commit/dd0d3c94881c53f47a84ea3c37537b6157a5e392))


### Features

* :lipstick: show alert for 'go to agenda item' when no agenda items are linked ([97ddcd1](https://github.com/ksalzke/agendas-for-omnifocus/commit/97ddcd1f311298ff10d906b7a5b6b39ec271b816))
* :lipstick: update 'go to' actions to use project view in new tab ([4513a57](https://github.com/ksalzke/agendas-for-omnifocus/commit/4513a57c9206dbd6f1a88ab28445140b935519e8))
* :sparkles: add processing option to 'go to' an agenda item in projects ([50cca02](https://github.com/ksalzke/agendas-for-omnifocus/commit/50cca02c3975601e2458a23d7018ad4a99b83e47))
* ✨ add ability to rename tasks in processing dialogue ([#13](https://github.com/ksalzke/agendas-for-omnifocus/issues/13)) ([ed229e7](https://github.com/ksalzke/agendas-for-omnifocus/commit/ed229e7f56ee9ef0203b4392c1b9472bdb6a8f5f))



## [1.2.1](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.2.0...v1.2.1) (2022-02-08)


### Bug Fixes

* :bug: remove 'linked event' tag from event task when 'remove from agenda' run (if no agenda items remaining) ([eec21fd](https://github.com/ksalzke/agendas-for-omnifocus/commit/eec21fd9ece7abafd89c2ac7eec8574921b41a5f))



# [1.2.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/v1.1.0...v1.2.0) (2022-02-07)


### Bug Fixes

* :bug: await result of getEventTags in getAllEvents function ([3569d07](https://github.com/ksalzke/agendas-for-omnifocus/commit/3569d07bc71f9d324c883970cfc208001b4aaaaa))
* :bug: fix issue with Preferences not displaying if relevant tags are deleted ([eefb5b6](https://github.com/ksalzke/agendas-for-omnifocus/commit/eefb5b6dca663e685d0ae3c3009602e279b38878))
* :bug: only allow an item to be added to an agenda when there is not an existing link ([b3f3a48](https://github.com/ksalzke/agendas-for-omnifocus/commit/b3f3a482fdbdb78432980f8a113816508fddf231))


### Features

* :lipstick: only show events in dropdown for 'add to agenda' if they are not already linked to all of the selected agenda items ([8fee9cb](https://github.com/ksalzke/agendas-for-omnifocus/commit/8fee9cb1a3c3fd164ca1c71393e97934a8b96645))
* :sparkles: add 'linked event' tag ([#11](https://github.com/ksalzke/agendas-for-omnifocus/issues/11)) ([6305d62](https://github.com/ksalzke/agendas-for-omnifocus/commit/6305d62f920a8472dda40cab39ecce46d06cc5e5))
* :sparkles: allow event tasks to be added to agendas ([c044770](https://github.com/ksalzke/agendas-for-omnifocus/commit/c044770ec42ab51e3b3023c77ea50065aa415bbc))



# [1.1.0](https://github.com/ksalzke/agendas-for-omnifocus/compare/b1bfdea586edaca2603683fb1220656494d0b0cd...v1.1.0) (2022-02-05)


### Features

* :sparkles: add Keyboard Maestro macro ([b1bfdea](https://github.com/ksalzke/agendas-for-omnifocus/commit/b1bfdea586edaca2603683fb1220656494d0b0cd))




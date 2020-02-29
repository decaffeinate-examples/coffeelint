/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
//
// Tests for the command line tool.
//

const path = require('path');
const fs = require('fs');
const vows = require('vows');
const assert = require('assert');
const { spawn, exec } = require('child_process');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

// The path to the command line tool.
const coffeelintPath = path.join('..', 'bin', 'coffeelint');

const execOptions = {cwd: __dirname};
// Run the coffeelint command line with the given
// args. Callback will be called with (error, stdout,
// stderr)
const commandline = (args, callback) => exec(`${coffeelintPath} ${args.join(' ')}`, execOptions, callback);


process.env.HOME = '';
process.env.HOMEPATH = '';
process.env.USERPROFILE = '';
process.env.COFFEELINT_CONFIG = '';

// Custom rules are loaded by module name. Using a relative path in the test is
// an unrealistic example when rules can be installed with `npm install -g
// some-custom-rule`. This will setup a fake version of node_modules to a
// relative path doesn't have to be used.
process.env.NODE_PATH += ':' + path.resolve(__dirname,
    'fixtures/mock_node_modules/');

vows.describe('commandline').addBatch({

    'with no args': {
        topic() {
            commandline([], this.callback);
            return undefined;
        },

        'shows usage'(error, stdout, stderr) {
            assert.isNotNull(error);
            assert.notEqual(error.code, 0);
            assert.include(stderr, 'Usage');
            return assert.isEmpty(stdout);
        }
    },

    'version': {
        topic() {
            commandline(['--version'], this.callback);
            return undefined;
        },

        'exists'(error, stdout, stderr) {
            assert.isNull(error);
            assert.isEmpty(stderr);
            assert.isString(stdout);
            return assert.include(stdout, coffeelint.VERSION);
        }
    },

    'with clean source': {
        topic() {
            const args = [
                '--noconfig',
                'fixtures/clean.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'passes'(error, stdout, stderr) {
            assert.isNull(error);
            assert.include(stdout, '0 errors and 0 warnings');
            return assert.isEmpty(stderr);
        }
    },

    'with failing source': {
        topic() {
            const args = [
                '--noconfig',
                'fixtures/fourspaces.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            assert.isNotNull(error);
            return assert.include(stdout.toLowerCase(), 'line');
        }
    },

    'with findconfig and local coffeelint.json': {
        topic() {
            const args = [
                'fixtures/findconfigtest/sevenspaces.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNull(error);
        }
    },

    'with findconfig and local package.json': {
        topic() {
            const args = [
                'fixtures/findconfigtest/package/sixspaces.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNull(error);
        }
    },

    'with findconfig and local coffeelint.json and extended config': {
        topic() {
            const args = [
                'fixtures/find_extended_test/invalid.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNull(error);
        }
    },

    'with custom configuration': {
        topic() {
            const args = [
                '-f',
                'fixtures/fourspaces.json',
                'fixtures/fourspaces.coffee'
            ];

            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNull(error);
        }
    },

    'with --rules parameter for a custom plugin': {
        topic() {
            const args = [
                '--rules',
                // It's up to NodeJS to resolve the actual path. The top of the
                // file modifies NODE_PATH so this can look like a 3rd party
                // module.
                'he_who_must_not_be_named',
                'fixtures/custom_rules/voldemort.coffee'
            ];

            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            assert.isNotNull(error);
            assert.include(stdout.toLowerCase(), '#1: forbidden variable name');
            assert.include(stdout.toLowerCase(), '#7: forbidden variable name');
            assert.include(stdout.toLowerCase(), '#9: forbidden variable name');
            return assert.include(stdout.toLowerCase(), '#11: forbidden variable name');
        }
    },

    'with `module` specified for a specific rule': {
        topic() {
            const args = [
                '-f',
                'fixtures/custom_rules/rule_module.json',
                'fixtures/custom_rules/voldemort.coffee'
            ];

            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            assert.isNotNull(error);
            return assert.include(stdout.toLowerCase(), 'forbidden variable name');
        }
    },

    'with multiple sources': {
        topic() {
            const args = [
                '--noconfig',
                '-f',
                'fixtures/fourspaces.json',
                'fixtures/fourspaces.coffee',
                'fixtures/clean.coffee'
            ];

            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNotNull(error);
        }
    },

    'with configuration file': {
        topic() {
            const configPath = '../generated_coffeelint.json';
            const configFile = fs.openSync(configPath, 'w');
            commandline(['--makeconfig'], (error, stdout, stderr) => {
                fs.writeSync(configFile, stdout);
                assert.isNull(error);
                const args = [
                    '-f',
                    configPath,
                    'fixtures/clean.coffee'
                ];
                return commandline(args, (...args) => {
                    return this.callback(stdout, ...Array.from(args));
                });
            });

            return undefined;
        },

        'works'(config, error, stdout, stderr) {
            assert.isNotNull(config);
            // This will throw an exception if it doesn't parse.
            JSON.parse(config);
            assert.isNotNull(stdout);
            return assert.isNull(error);
        }
    },

    '--trimconfig with default': {
        topic() {
            const configPath = '../generated_coffeelint.json';
            const args = [
                '-f',
                configPath,
                '--trimconfig'
            ];
            commandline(args, (error, stdout) => {
                return this.callback(null, stdout);
            });

            return undefined;
        },

        'works'(config) {
            return assert.equal(config, '{}\n');
        }
    },

    "repo's coffeelint.json": {
        topic() {
            const args = [
                '-f',
                '../coffeelint.json',
                '--trimconfig'
            ];
            commandline(args, (error, stdout) => {
                return this.callback(null, stdout);
            });

            return undefined;
        },

        'is minimal'(error, config) {
            const expected = fs.readFileSync(
                path.join(__dirname, '..', 'coffeelint.json'), 'utf-8'
            );
            return assert.deepEqual(JSON.parse(config), JSON.parse(expected));
        }
    },

    'does not fail on warnings': {
        topic() {
            const args = [
                '-f',
                'fixtures/twospaces.warning.json',
                'fixtures/fourspaces.coffee'
            ];

            commandline(args, this.callback);
            return undefined;
        },

        'works'(error, stdout, stderr) {
            return assert.isNull(error);
        }
    },

    'with broken source': {
        topic() {
            const args = [
                '--noconfig',
                'fixtures/syntax_error.coffee'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'fails'(error, stdout, stderr) {
            return assert.isNotNull(error);
        }
    },

    'recurses subdirectories': {
        topic() {
            const args = [
                '--noconfig',
                '-r',
                'fixtures/clean.coffee',
                'fixtures/subdir'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'and reports errors'(error, stdout, stderr) {
            assert.isNotNull(error, 'returned err');
            return assert.include(stdout.toLowerCase(), 'line');
        }
    },

    'allows JSLint XML reporting': {
        // FIXME: Not sure how to unit test escaping w/o major refactoring
        topic() {
            const args = [
                '-f',
                '../coffeelint.json',
                'fixtures/cyclo_fail.coffee',
                '--reporter jslint'
            ];
            commandline(args, this.callback);
            return undefined;
        },

        'Handles cyclomatic complexity check'(error, stdout, stderr) {
            return assert.include(stdout.toLowerCase(), 'cyclomatic complexity');
        }
    },

    'using stdin': {

        'with working string': {
            topic() {
                exec(`echo y = 1 | ${coffeelintPath} --noconfig --stdin`,
                    execOptions, this.callback);
                return undefined;
            },

            'passes'(error, stdout, stderr) {
                assert.isNull(error);
                assert.isEmpty(stderr);
                assert.isString(stdout);
                return assert.include(stdout, '0 errors and 0 warnings');
            }
        },

        'with failing string due to whitespace': {
            topic() {
                exec(`echo 'x = 1 '| ${coffeelintPath} --noconfig --stdin`,
                    execOptions, this.callback);
                return undefined;
            },

            'fails'(error, stdout, stderr) {
                assert.isNotNull(error);
                return assert.include(stdout.toLowerCase(), 'trailing whitespace');
            }
        },

        'Autoloads config based on cwd': {
            topic() {
                exec('cat fixtures/cyclo_fail.coffee | ' +
                    coffeelintPath + ' --stdin', execOptions, this.callback);
                return undefined;
            },

            'fails'(error, stdout, stderr) {
                // This one is a warning, so error will be null.
                // assert.isNotNull(error)
                return assert.include(stdout.toLowerCase(), 'cyclomatic complexity');
            }
        }
    },


    'literate coffeescript': {

        'with working string': {
            topic() {
                exec("echo 'This is Markdown\n\n    y = 1' | " +
                    `${coffeelintPath} --noconfig --stdin --literate`,
                    execOptions, this.callback);
                return undefined;
            },

            'passes'(error, stdout, stderr) {
                assert.isNull(error);
                assert.isEmpty(stderr);
                assert.isString(stdout);
                return assert.include(stdout, '0 errors and 0 warnings');
            }
        },

        'with failing string due to whitespace': {
            topic() {
                exec("echo 'This is Markdown\n\n    x = 1 \n    y=2'| " +
                    `${coffeelintPath} --noconfig --stdin --literate`,
                    execOptions, this.callback);
                return undefined;
            },

            'fails'(error, stdout, stderr) {
                assert.isNotNull(error);
                return assert.include(stdout.toLowerCase(), 'trailing whitespace');
            }
        }
    },

    'additional file extention': {

        'find additional files with --ext key': {
            topic() {
                const args = [
                    '--ext',
                    'csbx',
                    'fixtures/custom_extention'
                    ];
                commandline(args, this.callback);
                return undefined;
            },

            'passes'(error, stdout, stderr) {
                assert.isNull(error);
                assert.isEmpty(stderr);
                assert.isString(stdout);
                return assert.include(stdout, '0 errors and 0 warnings in 1 file');
            }
        },

        'do not find additional files without --ext key': {
            topic() {
                const args = ['fixtures/custom_extention'];
                commandline(args, this.callback);
                return undefined;
            },

            'fails'(error, stdout, stderr) {
                assert.isNull(error);
                assert.isEmpty(stderr);
                assert.isString(stdout);
                return assert.include(stdout, '0 errors and 0 warnings in 0 file');
            }
        }
    },

    'using environment config file': {

        'with non existing enviroment set config file': {
            topic() {
                const args = [
                    'fixtures/clean.coffee'
                ];
                process.env.COFFEELINT_CONFIG = 'not_existing_293ujff';
                commandline(args, this.callback);
                return undefined;
            },

            'passes'(error, stdout, stderr) {
                return assert.isNull(error);
            }
        },

        'with existing enviroment set config file': {
            topic() {
                const args = [
                    'fixtures/fourspaces.coffee'
                ];
                const conf = 'fixtures/fourspaces.json';
                process.env.COFFEELINT_CONFIG = conf;
                commandline(args, this.callback);
                return undefined;
            },

            'passes'(error, stdout, stderr) {
                return assert.isNull(error);
            }
        },

        'with existing enviroment set config file + --noconfig': {
            topic() {
                const args = [
                    '--noconfig',
                    'fixtures/fourspaces.coffee'
                ];
                const conf = 'fixtures/fourspaces.json';
                process.env.COFFEELINT_CONFIG = conf;
                commandline(args, this.callback);
                return undefined;
            },

            'fails'(error, stdout, stderr) {
                return assert.isNotNull(error);
            }
        }
    },

    'reports using basic reporter': {
        'with option q set': {
            'and no errors occured': {
                topic() {
                    const args = ['-q', '--noconfig', 'fixtures/clean.coffee'];
                    commandline(args, this.callback);
                    return undefined;
                },

                'no output'(err, stdout, stderr) {
                    return assert.isEmpty(stdout);
                }
            },

            'and errors occured': {
                topic() {
                    const args = ['-q', 'fixtures/syntax_error.coffee'];
                    commandline(args, this.callback);
                    return undefined;
                },

                'output'(error, stdout, stderr) {
                    return assert.isNotEmpty(stdout);
                }
            }
        },

        'with option q not set': {
            'and no errors occured': {
                topic() {
                    const args = ['fixtures/clean.coffee'];
                    commandline(args, this.callback);
                    return undefined;
                },

                'output'(err, stdout, stderr) {
                    return assert.isNotEmpty(stdout);
                }
            },

            'and errors occured': {
                topic() {
                    const args = ['fixtures/syntax_error.coffee'];
                    commandline(args, this.callback);
                    return undefined;
                },

                'output'(error, stdout, stderr) {
                    return assert.isNotEmpty(stdout);
                }
            }
        }
    }

}).export(module);
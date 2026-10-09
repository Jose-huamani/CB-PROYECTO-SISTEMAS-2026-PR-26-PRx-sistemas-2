import path from 'node:path';

// Angular supplies absolute test paths. Relative globs also work in folders
// whose names contain parentheses, without moving or renaming the project.
export default {
  test: { pool: 'forks', maxWorkers: 1, fileParallelism: false },
  plugins: [{
    name: 'prx:test-paths',
    enforce: 'post',
    config(config) {
      const include = config.test?.include;
      if (include) {
        config.test.include = include.map((file) => path.isAbsolute(file)
          ? path.relative(config.root || process.cwd(), file).replaceAll('\\', '/')
          : file);
      }
    },
  }],
};

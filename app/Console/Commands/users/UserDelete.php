<?php

namespace App\Console\Commands\Users;

// ユーザーモデル
use App\Models\User;

use Illuminate\Console\Command;
use Cerbero\CommandValidator\ValidatesInput;

class UserDelete extends Command
{
    use ValidatesInput;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:user-delete {email : メールアドレスを入力}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ユーザーを削除します。';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * バリデーションルール
     *
     * @return array
     */
    protected function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255']
        ];
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $user = resolve(User::class)->where('email', $this->argument('email'))->first();

        \DB::beginTransaction();
        try {
            resolve(User::class)->destroy($user->id);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
 
        $this->info($user->name . '(' . $user->email . ') を削除しました。');

        return config('command.exit_code.SUCCESS');
    }
}

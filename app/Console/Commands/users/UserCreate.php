<?php

namespace App\Console\Commands\Users;

// ユーザーモデル
use App\Models\User;

// 追加フォームバリデーション
use App\Http\Requests\User\StoreRequest;

use Illuminate\Console\Command;
use Cerbero\CommandValidator\ValidatesInput;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

class UserCreate extends Command
{
    use ValidatesInput;
    use SendsPasswordResetEmails;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:user-create {name : ユーザー名を入力} {email : メールアドレスを入力} {role=1 : 権限を入力}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ユーザーを作成します。';

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
     * バリデーションルール(ログインユーザー追加のルールをそのまま使う)
     *
     * @return array
     */
    protected function rules(): array
    {
        return (new StoreRequest())->rules();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // パスワードリセットメールをパスワード設定メールに切り替えるフラグ
        \Config::set('temporary.passwordSet', true);

        \DB::beginTransaction();
        try {
            $user = resolve(User::class)->create([
                'name' => $this->argument('name'),
                'email' => $this->argument('email'),
                'password' => Hash::make(\Str::random(32)),
                'role' => $this->argument('role'),
            ]);
            $this->broker()->sendResetLink(
                ['email' => $this->argument('email')]
            );

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        $this->info($user->name . '(' . $user->email . ') を追加しました。');

        return config('command.exit_code.SUCCESS');
    }
}

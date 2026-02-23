<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("SET sql_mode = ''");
        DB::statement("UPDATE annonces SET status = 'active' WHERE status IN ('waiting', 'accepted')");
        DB::statement("UPDATE annonces SET status = 'blocked' WHERE status = 'refused'");
        DB::statement("ALTER TABLE annonces MODIFY status ENUM('active', 'blocked') NOT NULL DEFAULT 'active'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE annonces MODIFY status ENUM('waiting', 'accepted', 'refused') NOT NULL DEFAULT 'waiting'");
    }
};

.PHONY: seedTop5 seedTop50 seedReset ban unban dump restore

seedTop5:
	npm run seed:top5

seedTop50:
	npm run seed:top50

seedReset:
	npm run seed:reset

ban:
	npx ts-node scripts/banUser.ts

unban:
	npx ts-node scripts/unbanUser.ts

dump:
	./scripts/dbDump.sh

restore:
	./scripts/dbRestore.sh $(path)

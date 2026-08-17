from fastapi import FastAPI

app = FastAPI(title="ml-service")


@app.get("/")
async def root():
	return {"status": "ok"}

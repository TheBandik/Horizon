const host = "http://127.0.0.1:8000/";

export const getMediaTypes = async (): Promise<{ value: string; label: string }[]> => {
    const response = await fetch(host + "media-types/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return [
        { value: "", label: "Select media type" },
        ...data.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
        }))];
};

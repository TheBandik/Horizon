const host = "http://127.0.0.1:8000/";

export const getMediaTypes = async (): Promise<{ value: string; label: string }[]> => {
    const response = await fetch(host + "media-types/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data.map((item: { id: number; name: string }) => ({
        value: item.id.toString(),
        label: item.name,
    }));
};

export const getGenres = async (): Promise<{ value: string; label: string }[]> => {
    const response = await fetch(host + "genres/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data.map((item: { id: number; name: string }) => ({
        value: item.id.toString(),
        label: item.name,
    }));
};

export const getRoles = async (): Promise<{ value: string; label: string }[]> => {
    const response = await fetch(host + "roles/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data.map((item: { id: number; name: string }) => ({
        value: item.id.toString(),
        label: item.name,
    }));
};

export const getParticipants = async (): Promise<{ value: string; label: string }[]> => {
    const response = await fetch(host + "participants/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data.map((item: { id: number; name: string }) => ({
        value: item.id.toString(),
        label: item.name,
    }));
};

export const createMedia = async (mediaData: any): Promise<void> => {
    try {
        const response = await fetch(host + "media/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mediaData),
        });

        if (response.ok) {
            console.log("Data sent successfully");
        } else {
            console.error("Failed to send data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

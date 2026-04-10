import { IPostMeta } from "../types/post";
import { ICategory } from "../types/category";

export const transformToCategoryTree = (metaList: IPostMeta[]): ICategory[] => {
    const root: ICategory[] = [];

    metaList.forEach((meta) => {
        const { path } = meta.category; // 예: "tech/report/web"
        const parts = path.split("/");
        let currentLevel = root;

        parts.forEach((part, index) => {
            let existing = currentLevel.find((cat) => cat.slug === part);

            if (!existing) {
                existing = {
                    slug: part,
                    path: parts.slice(0, index + 1).join("/"),
                    children: [],
                };
                currentLevel.push(existing);
            }

            currentLevel = existing.children;
        });
    });

    return root;
};
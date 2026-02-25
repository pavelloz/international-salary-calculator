import { createSignal, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import type { Store } from "nanostores";

/**
 * A wrapper around `@nanostores/solid` `useStore` that delays reading
 * persistent client-side data (like localStorage) until AFTER hydration
 * has successfully matched the SSR payload.
 *
 * @param store The nanostore to subscribe to
 * @param fallback The default data structure to render during SSR and initial hydration pass
 */
export function useHydratedStore<T>(store: Store<T>, fallback: T) {
    // Pre-seed Solid with the explicit default server payload
    const [data, setData] = createSignal<T>(fallback);

    onMount(() => {
        // Component is safely mounted, hook into the reactive nano store
        const realStoreProxy = useStore(store);

        // Subscribe our faked signal to mirror the exact nanostore value
        // (We cast to `any` quickly to extract the wrapped proxy execution because
        // useStore returns an accessor function wrapper, not direct data).
        // The effect wrapper guarantees it stays in sync.
        const syncData = () => {
            setData(() => realStoreProxy());
        };

        // Subscribing manually to handle SolidJS 1.8 reactivity updates
        const unsubscribe = store.subscribe((newVal) => {
            setData(() => newVal);
        });

        // Populate immediately on mount
        syncData();

        return () => unsubscribe();
    });

    return data;
}

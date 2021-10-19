type Locale = {[key: string]: string}

interface I18nOptions{
    fallbacks?: string[],
    locales?: {[language: string]: Locale},
    lazyLocales?: {[language: string]: string},
}

interface I18n {
    ready: boolean;
    whenReady: Promise<void>;
    get(lang: string, substitutions?: Record<string, string>): string;
    get(lang: string, key: string, substitutions?: Record<string, string>): Promise<string>;
    getLocale(): string;
    setLocale(lang: string): Promise<void>;
    onLanguageChange(callback:(lang: string)=>void): void;
}

export default class implements I18n {
    private readonly fallbacks: string[];
    private readonly locales: Map<string, Locale>;
    private lazyLocales: Map<string, string>;

    ready = true;
    whenReady = Promise.resolve();
    

    constructor({fallbacks=["en","en-US","en-UK"], locales={}, lazyLocales={}}: I18nOptions){
        this.fallbacks = fallbacks;
        this.locales = new Map(Object.entries(locales));
        this.lazyLocales = new Map(Object.entries(lazyLocales));
        this.setLocale(this.getLanguage());
    }

    get(lang: string, substitutions?: Record<string, string>): string;
    get(lang: string, key: string, substitutions?: Record<string, string>): Promise<string>;
    get(lang: any, key?: any, substitutions?: any): Promise<string>|string {
        // if (typeof key == "string") 
        throw new Error("Method not implemented.");
    }

    onLanguageChange(callback: (lang: string) => void): void {
        throw new Error("Method not implemented.");
    }

    private async loadLocale(locale: string): Promise<void> {
        if (this.locales.has(locale)) return;
        if (this.lazyLocales.has(locale)) {
            const resolved = await fetch(this.lazyLocales.get(locale)!)
                .then(r=>r.json())
                .catch(()=>({}));
            this.locales.set(locale, resolved);
            return;
        }
        this.locales.set(locale, {});
    }

    private loadFallbacks(): Promise<PromiseSettledResult<void>[]> {
        return Promise.allSettled(this.fallbacks.map((locale)=>this.loadLocale(locale)));
    }

    private setLocale(locale: string): Promise<void> {
        return this.loadFallbacks().then(()=>this.loadLocale(locale));
    }

    getLanguage(): string {
        return "en";
    }
}

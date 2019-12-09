declare namespace Neo {
    abstract class UintVariable {
        protected _bits: Uint32Array;
        readonly bits: Uint32Array;
        constructor(bits: number | Uint8Array | Uint32Array | number[]);
        compareTo(other: UintVariable): number;
        equals(other: UintVariable): boolean;
        toString(): string;
        toArray(): Uint8Array;
    }
}
declare namespace Neo {
    class Uint64 extends UintVariable {
        static readonly MaxValue: Uint64;
        static readonly MinValue: Uint64;
        static readonly Zero: Uint64;
        constructor(low?: number, high?: number);
        add(other: Uint64): Uint64;
        and(other: number | Uint64): Uint64;
        leftShift(shift: number): Uint64;
        not(): Uint64;
        or(other: number | Uint64): Uint64;
        static parse(str: string): Uint64;
        rightShift(shift: number): Uint64;
        subtract(other: Uint64): Uint64;
        toInt32(): number;
        toNumber(): number;
        toString(): string;
        toUint32(): number;
        xor(other: number | Uint64): Uint64;
    }
}
declare namespace Neo {
    class BigInteger {
        private _sign;
        private _bits;
        static readonly MinusOne: BigInteger;
        static readonly One: BigInteger;
        static readonly Zero: BigInteger;
        constructor(value: number | string | ArrayBuffer | Uint8Array);
        static add(x: number | BigInteger, y: number | BigInteger): BigInteger;
        add(other: number | BigInteger): BigInteger;
        private static addTo;
        bitLength(): number;
        private static bitLengthInternal;
        private clamp;
        static compare(x: number | BigInteger, y: number | BigInteger): number;
        private static compareAbs;
        compareTo(other: number | BigInteger): number;
        private static create;
        static divide(x: number | BigInteger, y: number | BigInteger): BigInteger;
        divide(other: number | BigInteger): BigInteger;
        static divRem(x: number | BigInteger, y: number | BigInteger): {
            result: BigInteger;
            remainder: BigInteger;
        };
        static equals(x: number | BigInteger, y: number | BigInteger): boolean;
        equals(other: number | BigInteger): boolean;
        static fromString(str: string, radix?: number): BigInteger;
        private fromString;
        static fromUint8Array(arr: Uint8Array, sign?: number, littleEndian?: boolean): BigInteger;
        static fromUint8ArrayAutoSign(arr: Uint8Array, littleEndian?: boolean): BigInteger;
        private fromUint8Array;
        private fromUint64;
        private static getActualLength;
        private static getDoubleParts;
        getLowestSetBit(): number;
        isEven(): boolean;
        isZero(): boolean;
        leftShift(shift: number): BigInteger;
        static mod(x: number | BigInteger, y: number | BigInteger): BigInteger;
        mod(other: number | BigInteger): BigInteger;
        static modInverse(value: number | BigInteger, modulus: number | BigInteger): BigInteger;
        modInverse(modulus: number | BigInteger): BigInteger;
        static modPow(value: number | BigInteger, exponent: number | BigInteger, modulus: number | BigInteger): BigInteger;
        modPow(exponent: number | BigInteger, modulus: number | BigInteger): BigInteger;
        static multiply(x: number | BigInteger, y: number | BigInteger): BigInteger;
        multiply(other: number | BigInteger): BigInteger;
        private static multiplyTo;
        negate(): BigInteger;
        static parse(str: string): BigInteger;
        static pow(value: number | BigInteger, exponent: number): BigInteger;
        pow(exponent: number): BigInteger;
        static random(bitLength: number, rng?: Crypto): BigInteger;
        static remainder(x: number | BigInteger, y: number | BigInteger): BigInteger;
        remainder(other: number | BigInteger): BigInteger;
        rightShift(shift: number): BigInteger;
        sign(): number;
        static subtract(x: number | BigInteger, y: number | BigInteger): BigInteger;
        subtract(other: number | BigInteger): BigInteger;
        private static subtractTo;
        testBit(n: number): boolean;
        toInt32(): number;
        toString(radix?: number): string;
        toUint8Array(littleEndian?: boolean, length?: number): Uint8Array;
        toUint8ArrayWithSign(littleEndian?: boolean, length?: number): Uint8Array;
        toUint64(): Uint64;
    }
}
declare namespace Neo {
    class Cosigner implements IO.ISerializable {
        account: Neo.Uint160;
        scopes: WitnessScope;
        allowedContracts: Neo.Uint160[];
        allowedGroups: Cryptography.ECPoint[];
        maxSubitems: number;
        constructor();
        deserialize(reader: IO.BinaryReader): void;
        serialize(writer: IO.BinaryWriter): void;
    }
}
interface String {
    endsWith(str: string): boolean;
}
interface Number {
    endsWith(num: number): boolean;
}
interface Object {
    getVarSize<T>(): number;
}
declare namespace Neo {
    class Fixed8 implements IO.ISerializable {
        private data;
        static readonly MaxValue: Fixed8;
        static readonly MinusOne: Fixed8;
        static readonly MinValue: Fixed8;
        static readonly One: Fixed8;
        static readonly Satoshi: Fixed8;
        static readonly Zero: Fixed8;
        constructor(data: Uint64);
        add(other: Fixed8): Fixed8;
        compareTo(other: Fixed8): number;
        equals(other: Fixed8): boolean;
        static fromNumber(value: number): Fixed8;
        getData(): Uint64;
        static max(first: Fixed8, ...others: Fixed8[]): Fixed8;
        static min(first: Fixed8, ...others: Fixed8[]): Fixed8;
        static parse(str: string): Fixed8;
        subtract(other: Fixed8): Fixed8;
        toString(): string;
        deserialize(reader: IO.BinaryReader): void;
        serialize(writer: IO.BinaryWriter): void;
    }
}
declare type Func<T, TResult> = (arg: T) => TResult;
declare type Action<T> = Func<T, void>;
interface Array<T> {
    fill(value: T, start?: number, end?: number): any;
}
interface ArrayConstructor {
    copy<T>(src: ArrayLike<T>, srcOffset: number, dst: ArrayLike<T>, dstOffset: number, count: number): void;
    fromArray<T>(arr: ArrayLike<T>): Array<T>;
}
interface String {
    hexToBytes(): Uint8Array;
}
interface Uint8Array {
    toHexString(): string;
    clone(): Uint8Array;
    concat(data: Uint8Array): Uint8Array;
    isSignatureContract(): boolean;
}
interface Uint8ArrayConstructor {
    fromArrayBuffer(buffer: ArrayBuffer | ArrayBufferView): Uint8Array;
}
declare namespace Neo {
    class Long {
        low: number;
        high: number;
        unsigned: boolean;
        private static __isLong__;
        constructor(low: number, high: number, unsigned: boolean);
        static isLong(obj: any): boolean;
        private static INT_CACHE;
        private static UINT_CACHE;
        static fromInt(value: number, unsigned?: boolean): Long;
        static fromNumber(value: number, unsigned?: boolean): Long;
        static fromBits(lowBits: any, highBits: any, unsigned: any): Long;
        static fromString(str: string, unsigned?: number | boolean, radix?: number): Long;
        static fromValue(val: string | number | Long | {
            low: number;
            high: number;
            unsigned: boolean;
        }, unsigned?: boolean): Long;
        private static TWO_PWR_16_DBL;
        private static TWO_PWR_24_DBL;
        private static TWO_PWR_32_DBL;
        private static TWO_PWR_64_DBL;
        private static TWO_PWR_63_DBL;
        private static TWO_PWR_24;
        static ZERO: Long;
        static UZERO: Long;
        static ONE: Long;
        static UONE: Long;
        static NEG_ONE: Long;
        static MAX_VALUE: Long;
        static MAX_UNSIGNED_VALUE: Long;
        static MIN_VALUE: Long;
        toInt: () => number;
        toNumber: () => number;
        toString(radix?: number): string;
        getHighBits(): number;
        getHighBitsUnsigned(): number;
        getLowBits(): number;
        getLowBitsUnsigned(): number;
        getNumBitsAbs(): number;
        isZero: () => boolean;
        eqz: () => boolean;
        isNegative: () => boolean;
        isPositive: () => any;
        isOdd: () => boolean;
        isEven: () => boolean;
        equals: (other: any) => boolean;
        eq: (other: any) => boolean;
        notEquals: (other: any) => boolean;
        neq: (other: any) => boolean;
        ne: (other: any) => boolean;
        lessThan: (other: any) => boolean;
        lt: (other: any) => boolean;
        lessThanOrEqual: (other: any) => boolean;
        lte: (other: any) => boolean;
        le: (other: any) => boolean;
        greaterThan: (other: any) => boolean;
        gt: (other: any) => boolean;
        greaterThanOrEqual: (other: any) => boolean;
        gte: (other: any) => boolean;
        ge: (other: any) => boolean;
        compare: (other: any) => 1 | 0 | -1;
        comp: (other: any) => 1 | 0 | -1;
        negate: () => any;
        neg: () => any;
        add(addend: any): Long;
        subtract(subtrahend: any): Long;
        sub: (subtrahend: any) => Long;
        multiply(multiplier: any): Long;
        mul: (multiplier: any) => Long;
        divide(divisor: string | number | Long): Long;
        div: (divisor: string | number | Long) => Long;
        modulo(divisor: any): Long;
        mod: (divisor: any) => Long;
        rem: (divisor: any) => Long;
        not(): Long;
        and(other: any): Long;
        or(other: any): Long;
        xor(other: any): Long;
        shiftLeft(numBits: any): Long;
        shl: (numBits: any) => Long;
        shiftRight(numBits: any): Long;
        shr: (numBits: any) => Long;
        shiftRightUnsigned(numBits: any): Long;
        shru: (numBits: any) => Long;
        shr_u: (numBits: any) => Long;
        rotateLeft(numBits: any): Long;
        rotl: (numBits: any) => Long;
        rotateRight(numBits: any): Long;
        rotr: (numBits: any) => Long;
        toSigned(): Long;
        toUnsigned(): Long;
        toBytes(le?: boolean): Uint8Array;
        toBytesLE(): Uint8Array;
        toBytesBE(): Uint8Array;
        static fromBytes(bytes: number[] | Uint8Array, unsigned?: boolean, le?: boolean): Long;
        static fromBytesLE(bytes: number[] | Uint8Array, unsigned?: boolean): Long;
        static fromBytesBE(bytes: number[] | Uint8Array, unsigned?: boolean): Long;
    }
}
declare class NeoMap<TKey, TValue> {
    private _map;
    private _size;
    readonly size: number;
    clear(): void;
    delete(key: TKey): boolean;
    forEach(callback: (value: TValue, key: TKey, map: NeoMap<TKey, TValue>) => void): void;
    get(key: TKey): TValue;
    has(key: TKey): boolean;
    set(key: TKey, value: TValue): void;
}
declare type PromiseExecutor<T> = (resolve: Action<T | PromiseLike<T>>, reject: Action<any>) => void;
declare enum PromiseState {
    pending = 0,
    fulfilled = 1,
    rejected = 2
}
declare class NeoPromise<T> implements PromiseLike<T> {
    private _state;
    private _callback_attached;
    private _value;
    private _reason;
    private _onFulfilled;
    private _onRejected;
    private _next_promise;
    private _tag;
    constructor(executor: PromiseExecutor<T>);
    static all(iterable: NeoPromise<any>[]): NeoPromise<any[]>;
    catch<TResult>(onrejected: (reason: any) => PromiseLike<TResult>): PromiseLike<TResult>;
    private checkState;
    private reject;
    static reject(reason: any): PromiseLike<any>;
    private resolve;
    static resolve<T>(value: T | PromiseLike<T>): PromiseLike<T>;
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}
declare namespace Neo {
    class Uint160 extends UintVariable implements Neo.IO.ISerializable {
        static readonly Zero: Uint160;
        static Length: number;
        constructor(value?: ArrayBuffer);
        static parse(str: string): Uint160;
        serialize(writer: Neo.IO.BinaryWriter): void;
        deserialize(reader: Neo.IO.BinaryReader): void;
    }
}
declare namespace Neo {
    class Uint256 extends UintVariable {
        static readonly Zero: Uint256;
        constructor(value?: ArrayBuffer);
        static parse(str: string): Uint256;
    }
}
declare namespace Neo {
    enum WitnessScope {
        Global = 0,
        CalledByEntry = 1,
        CustomContracts = 16,
        CustomGroups = 32
    }
}
declare namespace Neo.Cryptography {
    class Aes {
        private static numberOfRounds;
        private static rcon;
        private static S;
        private static Si;
        private static T1;
        private static T2;
        private static T3;
        private static T4;
        private static T5;
        private static T6;
        private static T7;
        private static T8;
        private static U1;
        private static U2;
        private static U3;
        private static U4;
        private _Ke;
        private _Kd;
        private _lastCipherblock;
        readonly mode: string;
        constructor(key: ArrayBuffer | ArrayBufferView, iv: ArrayBuffer | ArrayBufferView);
        private static convertToInt32;
        decrypt(ciphertext: ArrayBuffer | ArrayBufferView): ArrayBuffer;
        decryptBlock(ciphertext: Uint8Array, plaintext: Uint8Array): void;
        encrypt(plaintext: ArrayBuffer | ArrayBufferView): ArrayBuffer;
        encryptBlock(plaintext: Uint8Array, ciphertext: Uint8Array): void;
    }
}
declare namespace Neo.Cryptography {
    class Base58 {
        static Alphabet: string;
        static decode(input: string): Uint8Array;
        static encode(input: Uint8Array): string;
    }
}
declare namespace Neo.Cryptography {
    class CryptoKey {
        type: string;
        extractable: boolean;
        algorithm: Algorithm;
        usages: string[];
        constructor(type: string, extractable: boolean, algorithm: Algorithm, usages: string[]);
    }
    class AesCryptoKey extends Neo.Cryptography.CryptoKey {
        private _key_bytes;
        constructor(_key_bytes: Uint8Array);
        static create(length: number): AesCryptoKey;
        export(): Uint8Array;
        static import(keyData: ArrayBuffer | ArrayBufferView): AesCryptoKey;
    }
    class ECDsaCryptoKey extends CryptoKey {
        publicKey: ECPoint;
        privateKey?: Uint8Array;
        constructor(publicKey: ECPoint, privateKey?: Uint8Array);
    }
}
declare namespace Neo.Cryptography {
    class ECCurve {
        Q: BigInteger;
        A: ECFieldElement;
        B: ECFieldElement;
        N: BigInteger;
        Infinity: ECPoint;
        G: ECPoint;
        static readonly secp256k1: ECCurve;
        static readonly secp256r1: ECCurve;
        constructor(Q: BigInteger, A: BigInteger, B: BigInteger, N: BigInteger, G: Uint8Array);
    }
}
declare namespace Neo.Cryptography {
    class ECDsa {
        private key;
        constructor(key: ECDsaCryptoKey);
        private static calculateE;
        static generateKey(curve: ECCurve): {
            privateKey: ECDsaCryptoKey;
            publicKey: ECDsaCryptoKey;
        };
        sign(message: ArrayBuffer | ArrayBufferView): ArrayBuffer;
        private static sumOfTwoMultiplies;
        verify(message: ArrayBuffer | ArrayBufferView, signature: ArrayBuffer | ArrayBufferView): boolean;
    }
}
declare namespace Neo.Cryptography {
    class ECFieldElement {
        value: BigInteger;
        private curve;
        constructor(value: BigInteger, curve: ECCurve);
        add(other: ECFieldElement): ECFieldElement;
        compareTo(other: ECFieldElement): number;
        divide(other: ECFieldElement): ECFieldElement;
        equals(other: ECFieldElement): boolean;
        private static fastLucasSequence;
        multiply(other: ECFieldElement): ECFieldElement;
        negate(): ECFieldElement;
        sqrt(): ECFieldElement;
        square(): ECFieldElement;
        subtract(other: ECFieldElement): ECFieldElement;
    }
}
declare namespace Neo.Cryptography {
    class ECPoint implements Neo.IO.ISerializable {
        x: ECFieldElement;
        y: ECFieldElement;
        curve: ECCurve;
        constructor(x: ECFieldElement, y: ECFieldElement, curve: ECCurve);
        static add(x: ECPoint, y: ECPoint): ECPoint;
        compareTo(other: ECPoint): number;
        static decodePoint(encoded: Uint8Array, curve: ECCurve): ECPoint;
        private static decompressPoint;
        static deserializeFrom(reader: IO.BinaryReader, curve: ECCurve): ECPoint;
        encodePoint(commpressed: boolean): Uint8Array;
        equals(other: ECPoint): boolean;
        static fromUint8Array(arr: Uint8Array, curve: ECCurve): ECPoint;
        isInfinity(): boolean;
        static multiply(p: ECPoint, n: Uint8Array | BigInteger): ECPoint;
        negate(): ECPoint;
        static parse(str: string, curve: ECCurve): ECPoint;
        static subtract(x: ECPoint, y: ECPoint): ECPoint;
        toString(): string;
        twice(): ECPoint;
        private static windowNaf;
        serialize(writer: Neo.IO.BinaryWriter): void;
        deserialize(reader: Neo.IO.BinaryReader): void;
    }
}
declare namespace Neo.Cryptography {
    class RandomNumberGenerator {
        private static _entropy;
        private static _strength;
        private static _started;
        private static _stopped;
        private static _key;
        private static addEntropy;
        static getRandomValues<T extends Int8Array | Uint8ClampedArray | Int16Array | Uint16Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | null>(array: T): T;
        private static getWeakRandomValues;
        private static processDeviceMotionEvent;
        private static processEvent;
        private static processMouseEvent;
        private static processTouchEvent;
        static startCollectors(): void;
        private static stopCollectors;
    }
}
interface String {
    base58Decode(): Uint8Array;
    base64UrlDecode(): Uint8Array;
    toAesKey(): PromiseLike<ArrayBuffer>;
}
interface Uint8Array {
    base58Encode(): string;
    base64UrlEncode(): string;
}
declare function escape(s: string): string;
declare function unescape(s: string): string;
declare namespace Neo.Cryptography {
}
declare namespace Neo.Cryptography {
    class RIPEMD160 {
        private static zl;
        private static zr;
        private static sl;
        private static sr;
        private static hl;
        private static hr;
        private static bytesToWords;
        private static wordsToBytes;
        private static processBlock;
        private static f1;
        private static f2;
        private static f3;
        private static f4;
        private static f5;
        private static rotl;
        static computeHash(data: ArrayBuffer | ArrayBufferView): ArrayBuffer;
    }
}
declare namespace Neo.Cryptography {
    class Sha256 {
        private static K;
        static computeHash(data: ArrayBuffer | ArrayBufferView): ArrayBuffer;
        private static ROTR;
        private static Σ0;
        private static Σ1;
        private static σ0;
        private static σ1;
        private static Ch;
        private static Maj;
    }
}
declare namespace Neo.IO {
    class BinaryReader {
        private input;
        private _buffer;
        private array_uint8;
        private array_int8;
        private array_uint16;
        private array_int16;
        private array_uint32;
        private array_int32;
        private array_float32;
        private array_float64;
        constructor(input: Stream);
        canRead(): number;
        close(): void;
        private fillBuffer;
        read(buffer: ArrayBuffer, index: number, count: number): number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(count: number): ArrayBuffer;
        readDouble(): number;
        readFixed8(): Fixed8;
        readInt16(): number;
        readInt32(): number;
        readSByte(): number;
        readSerializable(T: Function): ISerializable;
        readSerializableArray(T: Function, max?: number): ISerializable[];
        readSingle(): number;
        readUint16(): number;
        readUint160(): Uint160;
        readUint256(): Uint256;
        readUint32(): number;
        readUint64(): Uint64;
        readVarBytes(max?: number): ArrayBuffer;
        readVarInt(max?: number): number;
        readVarString(): string;
    }
}
declare namespace Neo.IO {
    class BinaryWriter {
        private output;
        private _buffer;
        private array_uint8;
        private array_int8;
        private array_uint16;
        private array_int16;
        private array_uint32;
        private array_int32;
        private array_float32;
        private array_float64;
        constructor(output: Stream);
        close(): void;
        seek(offset: number, origin: SeekOrigin): number;
        write(buffer: ArrayBuffer, index?: number, count?: number): void;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeDouble(value: number): void;
        writeInt16(value: number): void;
        writeInt32(value: number): void;
        writeInt64(value: Neo.Long): void;
        writeSByte(value: number): void;
        writeSerializableArray(array: ISerializable[]): void;
        writeSingle(value: number): void;
        writeUint16(value: number): void;
        writeUint32(value: number): void;
        writeUint64(value: Uint64): void;
        writeUintVariable(value: UintVariable): void;
        writeVarBytes(value: ArrayBuffer): void;
        writeVarInt(value: number): void;
        writeVarString(value: string): void;
    }
}
interface Uint8Array {
    asSerializable(T: Function): Neo.IO.ISerializable;
}
interface Uint8ArrayConstructor {
    fromSerializable(obj: Neo.IO.ISerializable): Uint8Array;
}
declare namespace Neo.IO {
    class Helper {
        static getVarSize(value: number): number;
        static getVarSize(value: string): number;
        static getVarSize(value: object): number;
    }
}
declare namespace Neo.IO {
    interface ISerializable {
        deserialize(reader: BinaryReader): void;
        serialize(writer: BinaryWriter): void;
    }
}
declare namespace Neo.IO {
    enum SeekOrigin {
        Begin = 0,
        Current = 1,
        End = 2
    }
    abstract class Stream {
        private _array;
        abstract canRead(): boolean;
        abstract canSeek(): boolean;
        abstract canWrite(): boolean;
        close(): void;
        abstract length(): number;
        abstract position(): number;
        abstract read(buffer: ArrayBuffer, offset: number, count: number): number;
        readByte(): number;
        abstract seek(offset: number, origin: SeekOrigin): number;
        abstract setLength(value: number): void;
        abstract write(buffer: ArrayBuffer, offset: number, count: number): void;
        writeByte(value: number): void;
    }
}
declare namespace Neo.IO {
    class MemoryStream extends Stream {
        private _buffers;
        private _origin;
        private _position;
        private _length;
        private _capacity;
        private _expandable;
        private _writable;
        constructor(capacity?: number);
        constructor(buffer: ArrayBuffer, writable?: boolean);
        constructor(buffer: ArrayBuffer, index: number, count: number, writable?: boolean);
        canRead(): boolean;
        canSeek(): boolean;
        canWrite(): boolean;
        capacity(): number;
        private findBuffer;
        length(): number;
        position(): number;
        read(buffer: ArrayBuffer, offset: number, count: number): number;
        private readInternal;
        seek(offset: number, origin: SeekOrigin): number;
        setLength(value: number): void;
        toArray(): ArrayBuffer;
        write(buffer: ArrayBuffer, offset: number, count: number): void;
    }
}
declare namespace Neo.IO.Caching {
    interface ITrackable<TKey> {
        key: TKey;
        trackState: TrackState;
    }
}
declare namespace Neo.IO.Caching {
    enum TrackState {
        None = 0,
        Added = 1,
        Changed = 2,
        Deleted = 3
    }
}
declare namespace Neo.IO.Caching {
    class TrackableCollection<TKey, TItem extends ITrackable<TKey>> {
        private _map;
        constructor(items?: ArrayLike<TItem>);
        add(item: TItem): void;
        clear(): void;
        commit(): void;
        forEach(callback: (value: TItem, key: TKey, collection: TrackableCollection<TKey, TItem>) => void): void;
        get(key: TKey): TItem;
        getChangeSet(): TItem[];
        has(key: TKey): boolean;
        remove(key: TKey): void;
    }
}
declare namespace ThinNeo {
    class contract {
        script: string;
        parameters: {
            "name": string;
            "type": string;
        }[];
        deployed: boolean;
    }
    class nep6account {
        address: string;
        nep2key: string;
        contract: contract;
        getPrivateKey(scrypt: nep6ScryptParameters, password: string, callback: (info: string, result: string | Uint8Array) => void): void;
    }
    class nep6ScryptParameters {
        N: number;
        r: number;
        p: number;
    }
    class nep6wallet {
        scrypt: nep6ScryptParameters;
        accounts: nep6account[];
        fromJsonStr(jsonstr: string): void;
        toJson(): any;
    }
}
declare module ThinNeo {
    enum OpCode {
        PUSH0 = 0,
        PUSHF = 0,
        PUSHBYTES1 = 1,
        PUSHBYTES2 = 2,
        PUSHBYTES3 = 3,
        PUSHBYTES4 = 4,
        PUSHBYTES5 = 5,
        PUSHBYTES6 = 6,
        PUSHBYTES7 = 7,
        PUSHBYTES8 = 8,
        PUSHBYTES9 = 9,
        PUSHBYTES10 = 10,
        PUSHBYTES11 = 11,
        PUSHBYTES12 = 12,
        PUSHBYTES13 = 13,
        PUSHBYTES14 = 14,
        PUSHBYTES15 = 15,
        PUSHBYTES16 = 16,
        PUSHBYTES17 = 17,
        PUSHBYTES18 = 18,
        PUSHBYTES19 = 19,
        PUSHBYTES20 = 20,
        PUSHBYTES21 = 21,
        PUSHBYTES22 = 22,
        PUSHBYTES23 = 23,
        PUSHBYTES24 = 24,
        PUSHBYTES25 = 25,
        PUSHBYTES26 = 26,
        PUSHBYTES27 = 27,
        PUSHBYTES28 = 28,
        PUSHBYTES29 = 29,
        PUSHBYTES30 = 30,
        PUSHBYTES31 = 31,
        PUSHBYTES32 = 32,
        PUSHBYTES33 = 33,
        PUSHBYTES34 = 34,
        PUSHBYTES35 = 35,
        PUSHBYTES36 = 36,
        PUSHBYTES37 = 37,
        PUSHBYTES38 = 38,
        PUSHBYTES39 = 39,
        PUSHBYTES40 = 40,
        PUSHBYTES41 = 41,
        PUSHBYTES42 = 42,
        PUSHBYTES43 = 43,
        PUSHBYTES44 = 44,
        PUSHBYTES45 = 45,
        PUSHBYTES46 = 46,
        PUSHBYTES47 = 47,
        PUSHBYTES48 = 48,
        PUSHBYTES49 = 49,
        PUSHBYTES50 = 50,
        PUSHBYTES51 = 51,
        PUSHBYTES52 = 52,
        PUSHBYTES53 = 53,
        PUSHBYTES54 = 54,
        PUSHBYTES55 = 55,
        PUSHBYTES56 = 56,
        PUSHBYTES57 = 57,
        PUSHBYTES58 = 58,
        PUSHBYTES59 = 59,
        PUSHBYTES60 = 60,
        PUSHBYTES61 = 61,
        PUSHBYTES62 = 62,
        PUSHBYTES63 = 63,
        PUSHBYTES64 = 64,
        PUSHBYTES65 = 65,
        PUSHBYTES66 = 66,
        PUSHBYTES67 = 67,
        PUSHBYTES68 = 68,
        PUSHBYTES69 = 69,
        PUSHBYTES70 = 70,
        PUSHBYTES71 = 71,
        PUSHBYTES72 = 72,
        PUSHBYTES73 = 73,
        PUSHBYTES74 = 74,
        PUSHBYTES75 = 75,
        PUSHDATA1 = 76,
        PUSHDATA2 = 77,
        PUSHDATA4 = 78,
        PUSHM1 = 79,
        PUSH1 = 81,
        PUSHT = 81,
        PUSH2 = 82,
        PUSH3 = 83,
        PUSH4 = 84,
        PUSH5 = 85,
        PUSH6 = 86,
        PUSH7 = 87,
        PUSH8 = 88,
        PUSH9 = 89,
        PUSH10 = 90,
        PUSH11 = 91,
        PUSH12 = 92,
        PUSH13 = 93,
        PUSH14 = 94,
        PUSH15 = 95,
        PUSH16 = 96,
        NOP = 97,
        JMP = 98,
        JMPIF = 99,
        JMPIFNOT = 100,
        CALL = 101,
        RET = 102,
        APPCALL = 103,
        SYSCALL = 104,
        TAILCALL = 105,
        DUPFROMALTSTACK = 106,
        TOALTSTACK = 107,
        FROMALTSTACK = 108,
        XDROP = 109,
        DUPFROMALTSTACKBOTTOM = 110,
        XSWAP = 114,
        XTUCK = 115,
        DEPTH = 116,
        DROP = 117,
        DUP = 118,
        NIP = 119,
        OVER = 120,
        PICK = 121,
        ROLL = 122,
        ROT = 123,
        SWAP = 124,
        TUCK = 125,
        CAT = 126,
        SUBSTR = 127,
        LEFT = 128,
        RIGHT = 129,
        SIZE = 130,
        INVERT = 131,
        AND = 132,
        OR = 133,
        XOR = 134,
        EQUAL = 135,
        INC = 139,
        DEC = 140,
        SIGN = 141,
        NEGATE = 143,
        ABS = 144,
        NOT = 145,
        NZ = 146,
        ADD = 147,
        SUB = 148,
        MUL = 149,
        DIV = 150,
        MOD = 151,
        SHL = 152,
        SHR = 153,
        BOOLAND = 154,
        BOOLOR = 155,
        NUMEQUAL = 156,
        NUMNOTEQUAL = 158,
        LT = 159,
        GT = 160,
        LTE = 161,
        GTE = 162,
        MIN = 163,
        MAX = 164,
        WITHIN = 165,
        SHA1 = 167,
        SHA256 = 168,
        HASH160 = 169,
        HASH256 = 170,
        CSHARPSTRHASH32 = 171,
        JAVAHASH32 = 173,
        CHECKSIG = 172,
        CHECKMULTISIG = 174,
        ARRAYSIZE = 192,
        PACK = 193,
        UNPACK = 194,
        PICKITEM = 195,
        SETITEM = 196,
        NEWARRAY = 197,
        NEWSTRUCT = 198,
        NEWMAP = 199,
        APPEND = 200,
        REVERSE = 201,
        REMOVE = 202,
        HASKEY = 203,
        KEYS = 204,
        VALUES = 205,
        SWITCH = 208,
        THROW = 240,
        THROWIFNOT = 241
    }
}
declare namespace ThinSdk {
    const ApplicationEngine: {
        [ ThinNeo.OpCode.PUSH0 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES1 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES2 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES3 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES4 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES5 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES6 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES7 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES8 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES9 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES10 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES11 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES12 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES13 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES14 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES15 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES16 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES17 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES18 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES19 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES20 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES21 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES22 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES23 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES24 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES25 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES26 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES27 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES28 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES29 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES30 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES31 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES32 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES33 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES34 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES35 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES36 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES37 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES38 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES39 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES40 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES41 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES42 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES43 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES44 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES45 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES46 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES47 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES48 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES49 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES50 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES51 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES52 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES53 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES54 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES55 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES56 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES57 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES58 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES59 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES60 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES61 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES62 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES63 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES64 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES65 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES66 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES67 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES68 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES69 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES70 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES71 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES72 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES73 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES74 ]: number;
        [ ThinNeo.OpCode.PUSHBYTES75 ]: number;
        [ ThinNeo.OpCode.PUSHDATA1 ]: number;
        [ ThinNeo.OpCode.PUSHDATA2 ]: number;
        [ ThinNeo.OpCode.PUSHDATA4 ]: number;
        [ ThinNeo.OpCode.PUSHM1 ]: number;
        [ ThinNeo.OpCode.PUSH1 ]: number;
        [ ThinNeo.OpCode.PUSH2 ]: number;
        [ ThinNeo.OpCode.PUSH3 ]: number;
        [ ThinNeo.OpCode.PUSH4 ]: number;
        [ ThinNeo.OpCode.PUSH5 ]: number;
        [ ThinNeo.OpCode.PUSH6 ]: number;
        [ ThinNeo.OpCode.PUSH7 ]: number;
        [ ThinNeo.OpCode.PUSH8 ]: number;
        [ ThinNeo.OpCode.PUSH9 ]: number;
        [ ThinNeo.OpCode.PUSH10 ]: number;
        [ ThinNeo.OpCode.PUSH11 ]: number;
        [ ThinNeo.OpCode.PUSH12 ]: number;
        [ ThinNeo.OpCode.PUSH13 ]: number;
        [ ThinNeo.OpCode.PUSH14 ]: number;
        [ ThinNeo.OpCode.PUSH15 ]: number;
        [ ThinNeo.OpCode.PUSH16 ]: number;
        [ ThinNeo.OpCode.NOP ]: number;
        [ ThinNeo.OpCode.JMP ]: number;
        [ ThinNeo.OpCode.JMPIF ]: number;
        [ ThinNeo.OpCode.JMPIFNOT ]: number;
        [ ThinNeo.OpCode.CALL ]: number;
        [ ThinNeo.OpCode.RET ]: number;
        [ ThinNeo.OpCode.SYSCALL ]: number;
        [ ThinNeo.OpCode.DUPFROMALTSTACKBOTTOM ]: number;
        [ ThinNeo.OpCode.DUPFROMALTSTACK ]: number;
        [ ThinNeo.OpCode.TOALTSTACK ]: number;
        [ ThinNeo.OpCode.FROMALTSTACK ]: number;
        [ ThinNeo.OpCode.XDROP ]: number;
        [ ThinNeo.OpCode.XSWAP ]: number;
        [ ThinNeo.OpCode.XTUCK ]: number;
        [ ThinNeo.OpCode.DEPTH ]: number;
        [ ThinNeo.OpCode.DROP ]: number;
        [ ThinNeo.OpCode.DUP ]: number;
        [ ThinNeo.OpCode.NIP ]: number;
        [ ThinNeo.OpCode.OVER ]: number;
        [ ThinNeo.OpCode.PICK ]: number;
        [ ThinNeo.OpCode.ROLL ]: number;
        [ ThinNeo.OpCode.ROT ]: number;
        [ ThinNeo.OpCode.SWAP ]: number;
        [ ThinNeo.OpCode.TUCK ]: number;
        [ ThinNeo.OpCode.CAT ]: number;
        [ ThinNeo.OpCode.SUBSTR ]: number;
        [ ThinNeo.OpCode.LEFT ]: number;
        [ ThinNeo.OpCode.RIGHT ]: number;
        [ ThinNeo.OpCode.SIZE ]: number;
        [ ThinNeo.OpCode.INVERT ]: number;
        [ ThinNeo.OpCode.AND ]: number;
        [ ThinNeo.OpCode.OR ]: number;
        [ ThinNeo.OpCode.XOR ]: number;
        [ ThinNeo.OpCode.EQUAL ]: number;
        [ ThinNeo.OpCode.INC ]: number;
        [ ThinNeo.OpCode.DEC ]: number;
        [ ThinNeo.OpCode.SIGN ]: number;
        [ ThinNeo.OpCode.NEGATE ]: number;
        [ ThinNeo.OpCode.ABS ]: number;
        [ ThinNeo.OpCode.NOT ]: number;
        [ ThinNeo.OpCode.NZ ]: number;
        [ ThinNeo.OpCode.ADD ]: number;
        [ ThinNeo.OpCode.SUB ]: number;
        [ ThinNeo.OpCode.MUL ]: number;
        [ ThinNeo.OpCode.DIV ]: number;
        [ ThinNeo.OpCode.MOD ]: number;
        [ ThinNeo.OpCode.SHL ]: number;
        [ ThinNeo.OpCode.SHR ]: number;
        [ ThinNeo.OpCode.BOOLAND ]: number;
        [ ThinNeo.OpCode.BOOLOR ]: number;
        [ ThinNeo.OpCode.NUMEQUAL ]: number;
        [ ThinNeo.OpCode.NUMNOTEQUAL ]: number;
        [ ThinNeo.OpCode.LT ]: number;
        [ ThinNeo.OpCode.GT ]: number;
        [ ThinNeo.OpCode.LTE ]: number;
        [ ThinNeo.OpCode.GTE ]: number;
        [ ThinNeo.OpCode.MIN ]: number;
        [ ThinNeo.OpCode.MAX ]: number;
        [ ThinNeo.OpCode.WITHIN ]: number;
        [ ThinNeo.OpCode.ARRAYSIZE ]: number;
        [ ThinNeo.OpCode.PACK ]: number;
        [ ThinNeo.OpCode.UNPACK ]: number;
        [ ThinNeo.OpCode.PICKITEM ]: number;
        [ ThinNeo.OpCode.SETITEM ]: number;
        [ ThinNeo.OpCode.NEWARRAY ]: number;
        [ ThinNeo.OpCode.NEWSTRUCT ]: number;
        [ ThinNeo.OpCode.NEWMAP ]: number;
        [ ThinNeo.OpCode.APPEND ]: number;
        [ ThinNeo.OpCode.REVERSE ]: number;
        [ ThinNeo.OpCode.REMOVE ]: number;
        [ ThinNeo.OpCode.HASKEY ]: number;
        [ ThinNeo.OpCode.KEYS ]: number;
        [ ThinNeo.OpCode.VALUES ]: number;
        [ ThinNeo.OpCode.THROW ]: number;
        [ ThinNeo.OpCode.THROWIFNOT ]: number;
    };
}
declare namespace ThinNeo {
    class Base64 {
        static lookup: any[];
        static revLookup: any[];
        static code: string;
        static binited: boolean;
        static init(): void;
        static placeHoldersCount(b64: string): number;
        static byteLength(b64: string): number;
        static toByteArray(b64: string): Uint8Array;
        static tripletToBase64(num: any): any;
        static encodeChunk(uint8: any, start: any, end: any): string;
        static fromByteArray(uint8: Uint8Array): string;
    }
}
declare namespace ThinSdk {
    class Contract {
        contractHash: Neo.Uint160;
        scriptBuilder: ThinNeo.ScriptBuilder;
        constructor(_contractHash: Neo.Uint160, _scriptBuild: ThinNeo.ScriptBuilder);
        Call(method: string, ...args: any[]): void;
        static emitAppCall(sb: ThinNeo.ScriptBuilder, scriptHash: Neo.Uint160, operation: string, ...args: any[]): ThinNeo.ScriptBuilder;
    }
}
declare namespace ThinSdk {
    class NeoTransaction {
        scriptBuilder: ThinNeo.ScriptBuilder;
        tran: ThinNeo.Transaction;
        contract: Contract;
        gas: Token.GAS;
        neo: Token.NEO;
        constructor(sender: Neo.Uint160, currentBlockIndex: number);
        signAndPack(prikey: Uint8Array, sysFee: number): Uint8Array;
        getTranMessage(): string;
        getTranData(): string;
        getWeakRandomValues(array: number | Uint8Array): Uint8Array;
    }
}
declare namespace ThinNeo {
    class ScriptBuilder {
        writer: number[];
        Offset: number;
        constructor();
        _WriteUint8(num: number): void;
        _WriteUint16(num: number): void;
        _WriteUint32(num: number): void;
        _WriteUint8Array(nums: Uint8Array): void;
        _ConvertInt16ToBytes(num: number): Uint8Array;
        Emit(op: OpCode, arg?: Uint8Array): ScriptBuilder;
        EmitAppCall(scriptHash: Uint8Array | Neo.Uint160, useTailCall?: boolean): ScriptBuilder;
        EmitJump(op: OpCode, offset: number): ScriptBuilder;
        EmitPushNumber(number: Neo.BigInteger): ScriptBuilder;
        EmitPushBool(data: boolean): ScriptBuilder;
        EmitPushBytes(data: Uint8Array): ScriptBuilder;
        EmitPushString(data: string): ScriptBuilder;
        EmitSysCall(api: string): ScriptBuilder;
        ToArray(): Uint8Array;
        EmitParamJson(param: any): ScriptBuilder;
    }
}
declare module ThinNeo {
    class Helper {
        static GetPrivateKeyFromWIF(wif: string): Uint8Array;
        static GetWifFromPrivateKey(prikey: Uint8Array): string;
        static GetPublicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array;
        static Hash160(data: Uint8Array): Uint8Array;
        static GetAddressCheckScriptFromPublicKey(publicKey: Uint8Array): Uint8Array;
        static GetPublicKeyScriptHashFromPublicKey(publicKey: Uint8Array): Uint8Array;
        static GetScriptHashFromScript(script: Uint8Array): Uint8Array;
        static GetAddressFromScriptHash(scripthash: Uint8Array | Neo.Uint160): string;
        static GetAddressFromPublicKey(publicKey: Uint8Array): string;
        static GetPublicKeyScriptHash_FromAddress(address: string): Uint8Array;
        static Sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array;
        static VerifySignature(message: Uint8Array, signature: Uint8Array, pubkey: Uint8Array): boolean;
        static String2Bytes(str: any): Uint8Array;
        static Bytes2String(_arr: Uint8Array): string;
        static Aes256Encrypt(src: string, key: string): string;
        static Aes256Encrypt_u8(src: Uint8Array, key: Uint8Array): Uint8Array;
        static Aes256Decrypt_u8(encryptedkey: Uint8Array, key: Uint8Array): Uint8Array;
        static GetNep2FromPrivateKey(prikey: Uint8Array, passphrase: string, n: number, r: number, p: number, callback: (info: string, result: string) => void): void;
        static GetPrivateKeyFromNep2(nep2: string, passphrase: string, n: number, r: number, p: number, callback: (info: string, result: string | Uint8Array) => void): void;
    }
}
declare namespace ThinNeo {
    enum TransactionType {
        MinerTransaction = 0,
        IssueTransaction = 1,
        ClaimTransaction = 2,
        EnrollmentTransaction = 32,
        RegisterTransaction = 64,
        ContractTransaction = 128,
        PublishTransaction = 208,
        InvocationTransaction = 209
    }
    enum TransactionAttributeUsage {
        ContractHash = 0,
        ECDH02 = 2,
        ECDH03 = 3,
        Script = 32,
        Vote = 48,
        DescriptionUrl = 129,
        Description = 144,
        Hash1 = 161,
        Hash2 = 162,
        Hash3 = 163,
        Hash4 = 164,
        Hash5 = 165,
        Hash6 = 166,
        Hash7 = 167,
        Hash8 = 168,
        Hash9 = 169,
        Hash10 = 170,
        Hash11 = 171,
        Hash12 = 172,
        Hash13 = 173,
        Hash14 = 174,
        Hash15 = 175,
        Remark = 240,
        Remark1 = 241,
        Remark2 = 242,
        Remark3 = 243,
        Remark4 = 244,
        Remark5 = 245,
        Remark6 = 246,
        Remark7 = 247,
        Remark8 = 248,
        Remark9 = 249,
        Remark10 = 250,
        Remark11 = 251,
        Remark12 = 252,
        Remark13 = 253,
        Remark14 = 254,
        Remark15 = 255
    }
    class Attribute {
        usage: TransactionAttributeUsage;
        data: Uint8Array;
    }
    class TransactionAttribute implements Neo.IO.ISerializable {
        usage: TransactionAttributeUsage;
        data: Uint8Array;
        deserialize(ms: Neo.IO.BinaryReader): void;
        serialize(writer: Neo.IO.BinaryWriter): void;
    }
    class TransactionOutput {
        assetId: Uint8Array;
        value: Neo.Fixed8;
        toAddress: Uint8Array;
    }
    class TransactionInput {
        hash: Uint8Array;
        index: number;
    }
    class Witness {
        InvocationScript: Uint8Array;
        VerificationScript: Uint8Array;
        scriptHash: Uint8Array;
        readonly Address: string;
    }
    interface IExtData {
        Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void;
    }
    class InvokeTransData implements IExtData {
        script: Uint8Array;
        gas: Neo.Fixed8;
        Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void;
    }
    class ClaimTransData implements IExtData {
        claims: TransactionInput[];
        Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void;
    }
    class MinerTransData implements IExtData {
        nonce: number;
        Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void;
    }
    class Transaction {
        version: number;
        nonce: number;
        sender: Neo.Uint160;
        systemFee: Neo.Long;
        networkFee: Neo.Long;
        validUntilBlock: number;
        attributes: TransactionAttribute[];
        witnesses: Witness[];
        cosigners: Neo.Cosigner[];
        script: Uint8Array;
        static MaxTransactionSize: number;
        static MaxValidUntilBlockIncrement: number;
        private static MaxTransactionAttributes;
        private static MaxCosigners;
        SerializeUnsigned(writer: Neo.IO.BinaryWriter): void;
        Serialize(writer: Neo.IO.BinaryWriter): void;
        extdata: IExtData;
        DeserializeUnsigned(ms: Neo.IO.BinaryReader): void;
        Deserialize(ms: Neo.IO.BinaryReader): void;
        GetMessage(): Uint8Array;
        GetRawData(): Uint8Array;
        AddWitness(signdata: Uint8Array, pubkey: Uint8Array, addrs: string): void;
        AddWitnessScript(vscript: Uint8Array, iscript: Uint8Array, scripthash?: Uint8Array): void;
        GetHash(): Uint8Array;
        GetTxid(): string;
    }
}
declare namespace ThinNeo.VM {
    class RandomAccessStack<T> {
        private readonly list;
        readonly Count: number;
        Clear(): void;
        GetItem(index: number): T;
        Insert(index: number, item: T): void;
        Peek(index?: number): T;
        Pop(): T;
        Push(item: T): void;
        Remove(index: number): T;
        Set(index: number, item: T): void;
    }
}
declare module ThinNeo.Compiler {
    class Avm2Asm {
        static Trans(script: Uint8Array): Op[];
    }
}
declare module ThinNeo.Compiler {
    class ByteReader {
        constructor(data: Uint8Array);
        data: Uint8Array;
        addr: number;
        ReadOP(): OpCode;
        ReadBytes(count: number): Uint8Array;
        ReadByte(): number;
        ReadUInt16(): number;
        ReadInt16(): number;
        ReadUInt32(): number;
        ReadInt32(): number;
        ReadUInt64(): number;
        ReadVarBytes(): Uint8Array;
        ReadVarInt(): number;
        readonly End: boolean;
    }
}
declare module ThinNeo.Compiler {
    enum ParamType {
        None = 0,
        ByteArray = 1,
        String = 2,
        Addr = 3
    }
    class Op {
        addr: number;
        error: boolean;
        code: ThinNeo.OpCode;
        paramData: Uint8Array;
        paramType: ParamType;
        toString(): string;
        AsHexString(): string;
        AsString(): string;
        AsAddr(): number;
        getCodeName(): string;
    }
}
declare namespace ThinSdk.Token {
    class BaseToken extends Contract {
        constructor(_contractHash: Neo.Uint160, _scriptBuilder: ThinNeo.ScriptBuilder);
        transfer(from: string, to: string, amount: number): void;
        balanceOf(...accounts: Neo.Uint160[]): void;
        balanceOf_Unite(...accounts: Neo.Uint160[]): void;
        decimals(): void;
        symbol(): void;
    }
}
declare namespace ThinSdk.Token {
    class GAS extends BaseToken {
        constructor(sb: ThinNeo.ScriptBuilder);
    }
}
declare namespace ThinSdk.Token {
    class NEO extends BaseToken {
        constructor(sb: ThinNeo.ScriptBuilder);
    }
}
